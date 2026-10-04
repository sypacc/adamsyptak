import { useRef } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useModalBehavior } from "../hooks/useModalBehavior.js";

const EASE = [0.16, 1, 0.3, 1];

export default function Modal({ isOpen, onClose, id, labelledBy, className = "", fallbackFocus, children }) {
  const dialogRef = useRef(null);
  const reduceMotion = useReducedMotion();
  useModalBehavior(isOpen, onClose, dialogRef, fallbackFocus);

  const offset = reduceMotion ? 0 : 24;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-root" key={id}>
          <m.div
            className="modal-backdrop"
            id={id + "Backdrop"}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
          <m.div
            ref={dialogRef}
            className={"auth-modal " + className}
            id={id}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            initial={{ opacity: 0, y: offset, scale: reduceMotion ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: EASE } }}
            exit={{ opacity: 0, y: offset / 2, scale: reduceMotion ? 1 : 0.985, transition: { duration: 0.2 } }}
          >
            <button type="button" className="modal-close" id={id + "Close"} aria-label="Zavřít" onClick={onClose}>×</button>
            {children}
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}
