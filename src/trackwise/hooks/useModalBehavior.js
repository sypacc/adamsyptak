import { useEffect } from "react";

// Shared behaviour for the auth/cart/payment modals: locks page scroll
// while open and closes on Escape.
export function useModalBehavior(isOpen, onClose) {
  useEffect(() => {
    if (!isOpen) return undefined;
    document.body.style.overflow = "hidden";
    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);
}
