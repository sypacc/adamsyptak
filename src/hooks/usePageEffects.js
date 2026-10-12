import { useEffect } from "react";

// The two behaviours the page needs beyond CSS: the header marks the section
// in view, and blocks marked [data-reveal] fade in the first time they scroll
// into the viewport. Both degrade to "everything visible" without JS.
export function usePageEffects() {
  useEffect(() => {
    const cleanups = [];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Header: which section is in view */
    const links = Array.from(document.querySelectorAll(".nav a[href^='#']"));
    const sections = links
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    if (sections.length) {
      const setActive = (id) => {
        links.forEach((link) => {
          const active = link.getAttribute("href") === "#" + id;
          link.classList.toggle("is-active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      };
      const spy = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(entry.target.id);
          });
        },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
      );
      sections.forEach((s) => spy.observe(s));
      cleanups.push(() => spy.disconnect());
    }

    /* Reveal on scroll. Threshold 0: a block fades in as soon as its top
       clears the bottom tenth of the viewport, however tall it is. */
    const targets = Array.from(document.querySelectorAll("[data-reveal]"));
    if (targets.length && !reduceMotion) {
      const reveal = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            // Also reveal anything already scrolled past (anchor jump, fast
            // fling), so scrolling back never meets a hidden block.
            const passed = !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
            if (!entry.isIntersecting && !passed) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0, rootMargin: "0px 0px -10% 0px" }
      );
      targets.forEach((el) => reveal.observe(el));
      cleanups.push(() => reveal.disconnect());
    } else {
      targets.forEach((el) => el.classList.add("is-visible"));
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);
}
