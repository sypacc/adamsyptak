import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { useCart } from "../context/CartContext.jsx";
import Modal from "./Modal.jsx";

function fmt(n) {
  return n.toLocaleString("cs-CZ") + " Kč";
}

export default function CartModal() {
  const { cart, total, removeMerchItem, clearAll, isCartOpen, closeCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const isEmpty = cart.items.length === 0 && !cart.reservation;

  function handleCheckout() {
    // TODO: napojit skutečnou platební bránu / e-shop checkout.
    setIsCheckingOut(true);
    timer.current = window.setTimeout(() => {
      clearAll();
      setIsCheckingOut(false);
      closeCart();
    }, 700);
  }

  return (
    <Modal isOpen={isCartOpen} onClose={closeCart} id="cartModal" labelledBy="cartModalTitle" className="cart-modal" fallbackFocus="#cartTrigger">
      <p className="auth-modal-title" id="cartModalTitle">Košík</p>

      {cart.reservation && (
        <div className="cart-section" id="cartReservationSection">
          <p className="cart-section-title">Nezaplacená rezervace</p>
          <div className="cart-lines" id="cartReservationLines">
            <div className="cart-line">
              <div className="cart-line-info">
                <p>{cart.reservation.durationLabel}</p>
                <p className="cart-line-meta">
                  {cart.reservation.dateLabel}
                  {cart.reservation.timeLabel ? " · " + cart.reservation.timeLabel : ""}
                </p>
              </div>
              <p className="cart-line-price">{fmt(cart.reservation.price)}</p>
            </div>
          </div>
        </div>
      )}

      {cart.items.length > 0 && (
        <div className="cart-section" id="cartMerchSection">
          <p className="cart-section-title">Merch</p>
          <div className="cart-lines" id="cartMerchLines">
            <AnimatePresence initial={false}>
              {cart.items.map((item) => (
                <m.div
                  className="cart-line"
                  key={item.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24, transition: { duration: 0.2 } }}
                >
                  <div className="cart-line-info">
                    <p>{item.name}</p>
                    <p className="cart-line-meta">{item.qty}× {fmt(item.price)}</p>
                  </div>
                  <p className="cart-line-price">{fmt(item.qty * item.price)}</p>
                  <button type="button" className="cart-line-remove" aria-label={"Odebrat " + item.name} onClick={() => removeMerchItem(item.id)}>×</button>
                </m.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {isEmpty ? (
        <p className="cart-empty" id="cartEmptyNote">Košík je zatím prázdný.</p>
      ) : (
        <>
          <div className="cart-total" id="cartTotal">
            <span>Celkem</span>
            <strong>{fmt(total)}</strong>
          </div>
          <button className="btn-primary" type="button" id="cartCheckout" disabled={isCheckingOut} onClick={handleCheckout}>
            {isCheckingOut ? "Odesíláno…" : "Přejít k platbě →"}
          </button>
        </>
      )}
    </Modal>
  );
}
