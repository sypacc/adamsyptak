import { useEffect } from "react";
import "lenis/dist/lenis.css";

// Inertial wheel scrolling plus smooth in-page anchor jumps (Lenis reads the
// page's scroll-padding-top, so anchors still clear the fixed header).
// Only mouse/trackpad users benefit, so touch devices never load it, and on
// desktop it's pulled in on the first wheel/key interaction to keep it off
// the critical path. Lenis itself honours prefers-reduced-motion.
export function useSmoothScroll() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return undefined;

    let lenis = null;
    let cancelled = false;
    const triggers = ["wheel", "keydown", "pointerdown"];

    function start() {
      triggers.forEach((t) => window.removeEventListener(t, start));
      import("lenis").then(({ default: Lenis }) => {
        if (cancelled) return;
        lenis = new Lenis({ autoRaf: true, anchors: true, stopInertiaOnNavigate: true, lerp: 0.11 });
      });
    }

    triggers.forEach((t) => window.addEventListener(t, start, { passive: true, once: true }));
    return () => {
      cancelled = true;
      triggers.forEach((t) => window.removeEventListener(t, start));
      if (lenis) lenis.destroy();
    };
  }, []);
}
