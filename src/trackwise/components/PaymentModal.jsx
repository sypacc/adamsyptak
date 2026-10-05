import { useEffect, useRef, useState } from "react";
import Modal from "./Modal.jsx";

const METHODS = [
  { id: "card", label: "Kreditní/debetní karta", badges: ["VISA", "Mastercard"] },
  { id: "googlepay", label: "Google Pay", badges: ["G Pay"] },
  { id: "applepay", label: "Apple Pay", badges: [" Pay"] },
];

export default function PaymentModal({ isOpen, amountLabel, onClose, onConfirm }) {
  const [method, setMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function handleConfirm() {
    // TODO: napojit skutečnou platební bránu (karta / Google Pay / Apple Pay).
    setIsProcessing(true);
    timer.current = window.setTimeout(() => {
      setIsProcessing(false);
      onConfirm();
    }, 900);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} id="paymentModal" labelledBy="paymentModalTitle" className="payment-modal">
      <p className="auth-modal-title" id="paymentModalTitle">Způsob platby</p>
      <p className="payment-amount" id="paymentAmount">{amountLabel}</p>

      <fieldset className="payment-methods">
        <legend className="visually-hidden">Způsob platby</legend>
        {METHODS.map((pm) => (
          <label className="payment-method" key={pm.id}>
            <input
              type="radio"
              name="paymentMethod"
              value={pm.id}
              checked={method === pm.id}
              onChange={() => setMethod(pm.id)}
              data-autofocus={method === pm.id ? "" : undefined}
            />
            <span className="payment-method-label">{pm.label}</span>
            <span className="payment-badges">
              {pm.badges.map((b) => <span className="pay-badge" key={b}>{b}</span>)}
            </span>
          </label>
        ))}
      </fieldset>

      <button className="btn-primary" type="button" id="paymentConfirm" disabled={isProcessing} onClick={handleConfirm}>
        {isProcessing ? "Zpracováváme platbu…" : "Zaplatit →"}
      </button>
      <p className="auth-note">Demo — napojení na skutečnou platební bránu doplníme později.</p>
    </Modal>
  );
}
