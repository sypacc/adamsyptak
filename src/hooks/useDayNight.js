import { useEffect } from "react";

// Day/night for the portfolio, tied to the scroll rather than to a timed
// switch. The page changes only once: the dark intro gives way to daylight
// while the top of the light part (.section--light, from About onwards)
// travels from 90% to 40% of the viewport, and the rest of the page stays
// light. The value is eased towards its target every frame for extra
// smoothness and written to <html> as --day (backgrounds); text flips via
// --tday (see global.css).
const IN_START = 0.9;
const IN_END = 0.4;
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
    const lightStart = document.querySelector(".section--light");
    if (!lightStart) return undefined;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let current = 0;
    let textDay = false;
    let target = 0;
    let frame = 0;

    function measure() {
      const vh = window.innerHeight;
      const top = lightStart.getBoundingClientRect().top;
      return smoothstep(0, 1, (vh * IN_START - top) / (vh * (IN_START - IN_END)));
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
