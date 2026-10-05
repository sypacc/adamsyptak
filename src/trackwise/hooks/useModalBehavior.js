import { useEffect, useRef } from "react";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Shared dialog behaviour: locks page scroll, closes on Escape, keeps Tab
// focus inside the dialog and hands focus back to whatever opened it.
export function useModalBehavior(isOpen, onClose, dialogRef, fallbackFocus) {
  // Latest onClose without making it an effect dependency: callers often
  // pass inline arrows, and re-running this effect would bounce focus.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return undefined;

    const opener = document.activeElement;
    document.body.style.overflow = "hidden";

    const focusFirst = requestAnimationFrame(() => {
      const dialog = dialogRef && dialogRef.current;
      if (!dialog || dialog.contains(document.activeElement)) return;
      const target = dialog.querySelector("[data-autofocus]") || dialog.querySelector(FOCUSABLE);
      if (target) target.focus();
    });

    function onKeyDown(e) {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      const dialog = dialogRef && dialogRef.current;
      if (e.key !== "Tab" || !dialog) return;
      const items = Array.from(dialog.querySelectorAll(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(focusFirst);
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      // The opener may be gone (e.g. a toast button that dismissed itself);
      // fall back to a stable trigger so keyboard users don't land on <body>.
      const target = opener && document.contains(opener) ? opener : fallbackFocus && document.querySelector(fallbackFocus);
      if (target && typeof target.focus === "function") target.focus();
    };
  }, [isOpen, dialogRef, fallbackFocus]);
}
