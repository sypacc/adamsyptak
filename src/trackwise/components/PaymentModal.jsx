import { useState } from "react";
import { useModalBehavior } from "../hooks/useModalBehavior.js";

export default function PaymentModal({ isOpen, amountLabel, onClose, onConfirm }) {
  useModalBehavior(isOpen, onClose);
  const [method, setMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  function handleConfirm() {
    // TODO: napojit skutečnou platební bránu (karta / Google Pay / Apple Pay).
    setIsProcessing(true);
    window.setTimeout(() => {
      setIsProcessing(false);
      onConfirm();
    }, 900);
  }

  return (
    <>
      <div className="modal-backdrop" id="paymentBackdrop" hidden={!isOpen} onClick={onClose}></div>
      <div
        className="auth-modal payment-modal"
        id="paymentModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="paymentModalTitle"
        hidden={!isOpen}
      >
        <button type="button" className="modal-close" id="paymentClose" aria-label="Zavřít" onClick={onClose}>×</button>
        <p className="auth-modal-title" id="paymentModalTitle">Způsob platby</p>
        <p className="payment-amount" id="paymentAmount">{amountLabel}</p>

        <div className="payment-methods">
          <label className="payment-method">
            <input type="radio" name="paymentMethod" value="card" checked={method === "card"} onChange={() => setMethod("card")} />
            <span className="payment-method-label">Kreditní/debetní karta</span>
            <span className="payment-badges"><span className="pay-badge">VISA</span><span className="pay-badge">Mastercard</span></span>
          </label>
          <label className="payment-method">
            <input type="radio" name="paymentMethod" value="googlepay" checked={method === "googlepay"} onChange={() => setMethod("googlepay")} />
            <span className="payment-method-label">Google Pay</span>
            <span className="payment-badges"><span className="pay-badge">G Pay</span></span>
          </label>
          <label className="payment-method">
            <input type="radio" name="paymentMethod" value="applepay" checked={method === "applepay"} onChange={() => setMethod("applepay")} />
            <span className="payment-method-label">Apple Pay</span>
            <span className="payment-badges"><span className="pay-badge"> Pay</span></span>
          </label>
        </div>

        <button className="btn-primary" type="button" id="paymentConfirm" disabled={isProcessing} onClick={handleConfirm}>
          {isProcessing ? "Zpracováváme platbu…" : "Zaplatit →"}
        </button>
        <p className="auth-note">Demo — napojení na skutečnou platební bránu doplníme později.</p>
      </div>
    </>
  );
}
