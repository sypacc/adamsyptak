import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useModalBehavior } from "../hooks/useModalBehavior.js";

function fmt(n) {
  return n.toLocaleString("cs-CZ") + " Kč";
}

export default function CartModal() {
  const { cart, total, removeMerchItem, clearAll, isCartOpen, closeCart } = useCart();
  useModalBehavior(isCartOpen, closeCart);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const isEmpty = cart.items.length === 0 && !cart.reservation;

  function handleCheckout() {
    setIsCheckingOut(true);
    window.setTimeout(() => {
      clearAll();
      setIsCheckingOut(false);
      closeCart();
    }, 700);
  }

  return (
    <>
      <div className="modal-backdrop" id="cartBackdrop" hidden={!isCartOpen} onClick={closeCart}></div>
      <div
        className="auth-modal cart-modal"
        id="cartModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cartModalTitle"
        hidden={!isCartOpen}
      >
        <button type="button" className="modal-close" id="cartClose" aria-label="Zavřít" onClick={closeCart}>×</button>
        <p className="auth-modal-title" id="cartModalTitle">Košík</p>

        <div className="cart-section" id="cartReservationSection" hidden={!cart.reservation}>
          <p className="cart-section-title">Nezaplacená rezervace</p>
          <div className="cart-lines" id="cartReservationLines">
            {cart.reservation && (
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
            )}
          </div>
        </div>

        <div className="cart-section" id="cartMerchSection" hidden={cart.items.length === 0}>
          <p className="cart-section-title">Merch</p>
          <div className="cart-lines" id="cartMerchLines">
            {cart.items.map((item) => (
              <div className="cart-line" key={item.id}>
                <div className="cart-line-info">
                  <p>{item.name}</p>
                  <p className="cart-line-meta">{item.qty}× {fmt(item.price)}</p>
                </div>
                <p className="cart-line-price">{fmt(item.qty * item.price)}</p>
                <button type="button" className="cart-line-remove" aria-label="Odebrat" onClick={() => removeMerchItem(item.id)}>×</button>
              </div>
            ))}
          </div>
        </div>

        <p className="cart-empty" id="cartEmptyNote" hidden={!isEmpty}>Košík je zatím prázdný.</p>

        <div className="cart-total" id="cartTotal" hidden={isEmpty}>
          {!isEmpty && (
            <>
              <span>Celkem</span>
              <strong>{fmt(total)}</strong>
            </>
          )}
        </div>
        <button className="btn-primary" type="button" id="cartCheckout" hidden={isEmpty} disabled={isCheckingOut} onClick={handleCheckout}>
          {isCheckingOut ? "Odesíláno…" : "Přejít k platbě →"}
        </button>
      </div>
    </>
  );
}
