import { useEffect } from "react";
import { AnimatePresence, m } from "motion/react";
import { useCart } from "../context/CartContext.jsx";

const VISIBLE_MS = 3200;

export default function CartToast() {
  const { toast, dismissToast, openCart } = useCart();

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(dismissToast, VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [toast, dismissToast]);

  return (
    <div className="toast-region" role="status" aria-live="polite">
      <AnimatePresence>
        {toast && (
          <m.div
            key={toast.key}
            className="toast"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 420, damping: 32 } }}
            exit={{ opacity: 0, y: 12, transition: { duration: 0.18 } }}
          >
            <p className="toast-text">
              <strong>Přidáno do košíku</strong>
              <span>{toast.name} · {toast.price.toLocaleString("cs-CZ")} Kč</span>
            </p>
            <button
              type="button"
              className="toast-action"
              onClick={() => {
                dismissToast();
                openCart();
              }}
            >
              Zobrazit košík
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
