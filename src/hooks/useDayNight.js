import { useEffect } from "react";

// Day/night for the portfolio: while a light section (.section--light)
// holds the middle of the viewport, <html> gets .is-day and the CSS eases
// the whole palette to daylight; otherwise it eases back to night.
// A short section near the end of the page (Education) may never reach the
// middle on a tall screen, so a section that is fully on screen and sits in
// its upper part counts as lit too.
export function useDayNight() {
  useEffect(() => {
    const root = document.documentElement;
    const lightSections = Array.from(document.querySelectorAll(".section--light"));
    if (!lightSections.length) return undefined;

    let frame = 0;

    function isLit(section, vh) {
      const r = section.getBoundingClientRect();
      const mid = vh * 0.5;
      if (r.top <= mid && r.bottom >= mid) return true;
      return r.top >= 0 && r.bottom <= vh && (r.top + r.bottom) / 2 < vh * 0.55;
    }

    function update() {
      frame = 0;
      const vh = window.innerHeight;
      root.classList.toggle("is-day", lightSections.some((s) => isLit(s, vh)));
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      root.classList.remove("is-day");
    };
  }, []);
}
