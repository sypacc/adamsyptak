import { useEffect } from "react";
import { buildBackground, contentHeight } from "../utils/background.js";

// Ports every scroll/observer/pointer behaviour from the original
// assets/js/main.js onto the React-rendered DOM. Runs once after the
// portfolio page mounts; refs point at the same ids/classes the CSS
// already targets, so no styling had to change for the conversion.
export function useSiteEffects({ headerRef, navRef, navIndicatorRef, contoursElRef, contoursSvgRef, glowElRef }) {
  useEffect(() => {
    var header = headerRef.current;
    var nav = navRef.current;
    var navIndicator = navIndicatorRef.current;
    var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll("a")) : [];
    var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
    var contoursEl = contoursElRef.current;
    var contoursSvg = contoursSvgRef.current;
    var glowEl = glowElRef.current;
    var root = document.documentElement;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    var cleanupFns = [];

    /* ---------------------------------------------- */
    /* Background contour lines + glow blobs            */
    /* ---------------------------------------------- */
    // Purely decorative, so it's built off the critical path (idle time)
    // and fades in; afterwards it follows the page height via a
    // ResizeObserver, which also catches sections rendering late
    // (content-visibility) and fonts/images changing the height.
    var builtWidth = 0;
    var builtHeight = 0;
    function rebuildBackground() {
      buildBackground(contoursEl, contoursSvg, glowEl);
      builtWidth = window.innerWidth;
      builtHeight = contentHeight();
      if (contoursEl) contoursEl.classList.add("is-built");
      if (glowEl) glowEl.classList.add("is-built");
    }

    var idle = window.requestIdleCallback || function (cb) { return window.setTimeout(cb, 200); };
    var cancelIdle = window.cancelIdleCallback || window.clearTimeout;
    var idleHandle = idle(rebuildBackground, { timeout: 1200 });

    var resizeTimer = null;
    function scheduleRebuild() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        if (window.innerWidth !== builtWidth || Math.abs(contentHeight() - builtHeight) > 40) {
          rebuildBackground();
        }
        moveNavIndicator();
      }, 250);
    }
    var bodyObserver = new ResizeObserver(scheduleRebuild);
    bodyObserver.observe(document.body);
    cleanupFns.push(function () {
      cancelIdle(idleHandle);
      window.clearTimeout(resizeTimer);
      bodyObserver.disconnect();
    });

    /* ---------------------------------------------- */
    /* Scroll: header state, progress, ambient glow      */
    /* ---------------------------------------------- */
    // The scroll-driven custom properties are written only on the elements
    // that read them; setting them on <html> made every scroll frame restyle
    // the whole document.
    var progressEl = header ? header.querySelector(".scroll-progress") : null;
    var lastProgress = "0.0000";
    var lastGlow = "0.500";
    var scrollTicking = false;

    function updateScrollEffects() {
      var maxScroll = Math.max(root.scrollHeight - window.innerHeight, 1);
      var t = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      var progress = t.toFixed(4);
      if (progress !== lastProgress && progressEl) {
        progressEl.style.setProperty("--scroll-progress", progress);
        lastProgress = progress;
      }

      if (!reduceMotion) {
        var glow = ((Math.sin(window.scrollY / 400) + 1) / 2).toFixed(3);
        if (glow !== lastGlow) {
          if (glowEl) glowEl.style.setProperty("--glow-strength", glow);
          if (contoursEl) contoursEl.style.setProperty("--glow-strength", glow);
          lastGlow = glow;
        }
      }

      scrollTicking = false;
    }

    function onScroll() {
      var scrolled = window.scrollY > 4;
      if (header) header.classList.toggle("is-scrolled", scrolled);
      document.body.classList.toggle("is-scrolled", window.scrollY > 80);

      if (!scrollTicking) {
        scrollTicking = true;
        window.requestAnimationFrame(updateScrollEffects);
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanupFns.push(function () {
      window.removeEventListener("scroll", onScroll);
    });

    /* ---------------------------------------------- */
    /* Navigation: active section + indicator            */
    /* ---------------------------------------------- */
    function moveNavIndicator() {
      if (!navIndicator || !nav) return;
      var active = nav.querySelector("a.is-active");
      if (!active) {
        navIndicator.style.setProperty("--nav-visible", "0");
        return;
      }
      navIndicator.style.setProperty("--nav-x", active.offsetLeft + "px");
      navIndicator.style.setProperty("--nav-w", active.offsetWidth + "px");
      navIndicator.style.setProperty("--nav-visible", "1");
    }

    var sectionObserver = null;
    if (sections.length && navLinks.length) {
      sectionObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var id = entry.target.getAttribute("id");
            navLinks.forEach(function (link) {
              link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
            });
            moveNavIndicator();
          });
        },
        { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
      );
      sections.forEach(function (section) {
        sectionObserver.observe(section);
      });
      cleanupFns.push(function () {
        sectionObserver.disconnect();
      });
    }

    // Hovering a nav link previews the indicator there; leaving snaps it back.
    if (navIndicator && finePointer && nav) {
      var onLeaveNav = moveNavIndicator;
      navLinks.forEach(function (link) {
        function onEnter() {
          navIndicator.style.setProperty("--nav-x", link.offsetLeft + "px");
          navIndicator.style.setProperty("--nav-w", link.offsetWidth + "px");
          navIndicator.style.setProperty("--nav-visible", "1");
        }
        link.addEventListener("mouseenter", onEnter);
        cleanupFns.push(function () {
          link.removeEventListener("mouseenter", onEnter);
        });
      });
      nav.addEventListener("mouseleave", onLeaveNav);
      cleanupFns.push(function () {
        nav.removeEventListener("mouseleave", onLeaveNav);
      });
    }

    /* ---------------------------------------------- */
    /* Reveal on scroll (staggered per parent)           */
    /* ---------------------------------------------- */
    var revealTargets = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
    var revealTimers = [];

    function revealElement(el, delayMs) {
      el.style.setProperty("--reveal-delay", delayMs + "ms");
      el.classList.add("is-visible");
      // Hand transform/transition ownership back to the component's own
      // rules once the entrance is done (see the CSS comment on [data-reveal]).
      var timer = window.setTimeout(function () {
        el.removeAttribute("data-reveal");
        el.style.removeProperty("--reveal-delay");
      }, delayMs + 950);
      revealTimers.push(timer);
    }

    var revealObserver = null;
    if (revealTargets.length) {
      revealObserver = new IntersectionObserver(
        function (entries, observer) {
          // Elements entering in the same batch that share a parent get a
          // stagger, so grids ripple in instead of popping at once.
          var groups = new Map();
          entries.forEach(function (entry) {
            // Elements jumped past (anchor link, fast fling) are revealed too,
            // so scrolling back up never finds them still hidden.
            var passed = !entry.isIntersecting && entry.boundingClientRect.height > 0 && entry.boundingClientRect.bottom < 0;
            if (!entry.isIntersecting && !passed) return;
            var parent = entry.target.parentElement;
            if (!groups.has(parent)) groups.set(parent, []);
            groups.get(parent).push(entry.target);
            observer.unobserve(entry.target);
          });
          groups.forEach(function (els) {
            els.sort(function (a, b) {
              return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
            });
            els.forEach(function (el, i) {
              revealElement(el, Math.min(i * 80, 560));
            });
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
      );
      revealTargets.forEach(function (el) {
        revealObserver.observe(el);
      });
      cleanupFns.push(function () {
        revealObserver.disconnect();
        revealTimers.forEach(function (timer) {
          window.clearTimeout(timer);
        });
      });
    }

    /* ---------------------------------------------- */
    /* Pointer: tilt + spotlight                         */
    /* ---------------------------------------------- */
    if (finePointer && !reduceMotion) {
      var tiltTargets = Array.prototype.slice.call(document.querySelectorAll(".tilt"));
      tiltTargets.forEach(function (el) {
        function onMove(e) {
          var rect = el.getBoundingClientRect();
          var px = (e.clientX - rect.left) / rect.width - 0.5;
          var py = (e.clientY - rect.top) / rect.height - 0.5;
          var maxTilt = 5;
          el.style.setProperty("--tilt-x", (-py * maxTilt).toFixed(2) + "deg");
          el.style.setProperty("--tilt-y", (px * maxTilt).toFixed(2) + "deg");
        }
        function onLeave() {
          el.style.setProperty("--tilt-x", "0deg");
          el.style.setProperty("--tilt-y", "0deg");
        }
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        cleanupFns.push(function () {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
        });
      });
    }

    if (finePointer) {
      var spotTargets = Array.prototype.slice.call(document.querySelectorAll(".card, .principle, .spotlight"));
      spotTargets.forEach(function (el) {
        function onMove(e) {
          var rect = el.getBoundingClientRect();
          el.style.setProperty("--mx", (e.clientX - rect.left).toFixed(0) + "px");
          el.style.setProperty("--my", (e.clientY - rect.top).toFixed(0) + "px");
        }
        el.addEventListener("pointermove", onMove);
        cleanupFns.push(function () {
          el.removeEventListener("pointermove", onMove);
        });
      });
    }

    return function cleanup() {
      cleanupFns.forEach(function (fn) {
        fn();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
