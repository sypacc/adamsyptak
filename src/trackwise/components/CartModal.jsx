import { useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { useCart } from "../context/CartContext.jsx";
import { rangeConflict, saveUserBooking } from "../utils/booking.js";
import Modal from "./Modal.jsx";
import PaymentModal from "./PaymentModal.jsx";

function fmt(n) {
  return n.toLocaleString("cs-CZ") + " Kč";
}

export default function CartModal() {
  const { cart, total, removeMerchItem, clearReservation, clearAll, isCartOpen, openCart, closeCart, markPaid } = useCart();
  const [isPaying, setIsPaying] = useState(false);
  const [order, setOrder] = useState(null); // zaplacená objednávka → potvrzení v košíku
  const [error, setError] = useState(null);

  const isEmpty = cart.items.length === 0 && !cart.reservation;

  function handleClose() {
    closeCart();
    setOrder(null);
    setError(null);
  }

  // Rezervace v košíku musí mít přesný termín a ten musí být pořád volný.
  function reservationProblem() {
    const res = cart.reservation;
    if (!res) return null;
    const slot = res.slot;
    if (!slot) return "U rezervace chybí termín — vyber ho prosím znovu v rezervaci.";
    const conflict = rangeConflict(slot.dateKey, slot.start, slot.hours);
    return conflict ? "Termín tréninku už není volný (" + conflict.reason.toLowerCase() + ") — vyber prosím jiný." : null;
  }

  function handleCheckout() {
    const problem = reservationProblem();
    if (problem) {
      clearReservation();
      setError(problem);
      return;
    }
    setError(null);
    closeCart();
    setIsPaying(true);
  }

  function handlePaymentClose() {
    setIsPaying(false);
    openCart();
  }

  function handlePaid() {
    const res = cart.reservation;
    if (res && res.slot && !saveUserBooking(res.slot.dateKey, res.slot.start, res.slot.hours)) {
      // Termín mezitím někdo zabral — nic se nezaplatí, košík zůstává.
      setIsPaying(false);
      clearReservation();
      setError("Termín tréninku mezitím někdo zabral — platba neproběhla, vyber prosím jiný čas.");
      openCart();
      return;
    }
    const summary = { items: cart.items, reservation: res, total };
    markPaid(summary);
    clearAll();
    setOrder(summary);
    setIsPaying(false);
    openCart();
  }

  return (
    <>
    <Modal isOpen={isCartOpen} onClose={handleClose} id="cartModal" labelledBy="cartModalTitle" className="cart-modal" fallbackFocus="#cartTrigger">
      {order ? (
        <div className="cart-success" role="status">
          <p className="auth-modal-title" id="cartModalTitle">Zaplaceno ✓</p>
          <p className="cart-success-lead">Díky! Objednávka za <strong>{fmt(order.total)}</strong> je zaplacená.</p>
          <ul className="cart-success-list">
            {order.reservation && (
              <li>
                <span>{order.reservation.durationLabel}</span>
                <span className="cart-line-meta">{order.reservation.dateLabel}{order.reservation.timeLabel ? " · " + order.reservation.timeLabel : ""}</span>
              </li>
            )}
            {order.items.map((item) => (
              <li key={item.id}>
                <span>{item.name}</span>
                <span className="cart-line-meta">{item.qty}× {fmt(item.price)}</span>
              </li>
            ))}
          </ul>
          <p className="auth-note">{order.items.length > 0 ? "Merch ti pošleme po spuštění e-shopu. " : ""}Platba je zatím jen ukázka.</p>
          <button className="btn-primary" type="button" onClick={handleClose}>Hotovo</button>
        </div>
      ) : (
      <>
      <p className="auth-modal-title" id="cartModalTitle">Košík</p>
      {error && <p className="slot-error" role="alert">{error}</p>}

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
          <button className="btn-primary" type="button" id="cartCheckout" onClick={handleCheckout}>
            Přejít k platbě →
          </button>
        </>
      )}
      </>
      )}
    </Modal>

    <PaymentModal
      isOpen={isPaying}
      amountLabel={fmt(total)}
      onClose={handlePaymentClose}
      onConfirm={handlePaid}
    />
    </>
  );
}
