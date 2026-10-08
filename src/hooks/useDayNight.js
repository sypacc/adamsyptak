import { useEffect } from "react";

// Day/night for the portfolio, tied to the scroll rather than to a timed
// switch. Each light section (.section--light) brings daylight in while its
// top travels from 90% to 50% of the viewport and takes it out while its
// bottom travels from 50% to 10%, so the change is spread over a long
// stretch of scrolling and stops whenever the scrolling stops. The value is
// eased towards its target every frame for extra smoothness and written to
// <html> as --day (backgrounds); text flips via --tday (see global.css).
const IN_START = 0.9;
const IN_END = 0.5;
const OUT_START = 0.5;
const OUT_END = 0.1;
const EASE = 0.08;

function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function smoothstep(a, b, v) {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
}

export function useDayNight() {
  useEffect(() => {
    const root = document.documentElement;
    const lightSections = Array.from(document.querySelectorAll(".section--light"));
    if (!lightSections.length) return undefined;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let current = 0;
    let textDay = false;
    let target = 0;
    let frame = 0;

    function measure() {
      const vh = window.innerHeight;
      let day = 0;
      lightSections.forEach((section) => {
        const r = section.getBoundingClientRect();
        const fadeIn = clamp01((vh * IN_START - r.top) / (vh * (IN_START - IN_END)));
        const fadeOut = clamp01((r.bottom - vh * OUT_END) / (vh * (OUT_START - OUT_END)));
        day = Math.max(day, Math.min(fadeIn, fadeOut));
      });
      // At the very end of the page there's no more scrolling to finish a
      // half-done fade, so settle on whichever state is nearer instead of
      // leaving the last screen in a grey mid-tone.
      const atEnd = window.scrollY + vh >= document.documentElement.scrollHeight - 2;
      if (atEnd) day = Math.round(day);
      return smoothstep(0, 1, day);
    }

    function paint(value) {
      root.style.setProperty("--day", value.toFixed(4));
      // Flip point where dark and light text contrast about equally with
      // the mixed background; a little hysteresis stops it flickering.
      if (value > 0.42) textDay = true;
      else if (value < 0.36) textDay = false;
      root.style.setProperty("--tday", textDay ? "1" : "0");
      root.classList.toggle("is-day", textDay);
    }

    function tick() {
      frame = 0;
      target = measure();
      current = reduceMotion ? target : current + (target - current) * EASE;
      if (Math.abs(target - current) < 0.002) current = target;
      paint(current);
      if (current !== target) frame = requestAnimationFrame(tick);
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(tick);
    }

    current = target = measure();
    paint(current);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      root.classList.remove("is-day");
      root.style.removeProperty("--day");
      root.style.removeProperty("--tday");
    };
  }, []);
}
