(function () {
  "use strict";

  var header = document.getElementById("hlavicka");
  var nav = document.getElementById("hlavni-nav");
  var navToggle = document.getElementById("navToggle");
  var navIndicator = document.getElementById("navIndicator");
  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll("a")) : [];
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var yearEl = document.getElementById("rok");
  var contoursEl = document.getElementById("pageContours");
  var contoursSvg = document.getElementById("contoursSvg");
  var travelGlow = document.getElementById("travelGlow");
  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ------------------------------------------------ */
  /* Background contour lines                          */
  /* ------------------------------------------------ */

  // Build a wavy contour line at a given baseline y, spanning the full
  // svg width with a bit of overflow on each side.
  function buildWavePath(y, amplitude, phase) {
    var width = 1440;
    var segments = 4;
    var segmentWidth = (width + 100) / segments;
    var d = "M-50," + (y + Math.sin(phase) * amplitude).toFixed(1);
    for (var s = 0; s < segments; s++) {
      var x1 = -50 + segmentWidth * (s + 0.33);
      var x2 = -50 + segmentWidth * (s + 0.66);
      var xEnd = -50 + segmentWidth * (s + 1);
      var y1 = y + Math.sin(phase + s * 1.3) * amplitude;
      var y2 = y + Math.sin(phase + s * 1.3 + 1.5) * amplitude;
      var yEnd = y + Math.sin(phase + (s + 1) * 1.3) * amplitude;
      d += " C" + x1.toFixed(1) + "," + y1.toFixed(1) + " " + x2.toFixed(1) + "," + y2.toFixed(1) + " " + xEnd.toFixed(1) + "," + yEnd.toFixed(1);
    }
    return d;
  }

  // Contour lines span the whole document, not just one viewport, so
  // scrolling reveals genuinely different lines instead of a fixed image
  // being shifted around. Rebuilt on load and on resize.
  function buildContours() {
    if (!contoursEl || !contoursSvg) return;
    var pageHeight = Math.max(root.scrollHeight, window.innerHeight);
    contoursEl.style.height = pageHeight + "px";
    contoursSvg.setAttribute("viewBox", "0 0 1440 " + pageHeight);

    var spacing = 260;
    var count = Math.ceil(pageHeight / spacing) + 1;
    var frag = document.createDocumentFragment();

    for (var i = 0; i < count; i++) {
      var y = i * spacing + spacing / 2;
      var amplitude = 40 + (i % 3) * 20;
      var phase = i * 1.7;
      var d = buildWavePath(y, amplitude, phase);
      var duration = 20 + (i % 5) * 3 + "s";
      var delay = "-" + (i % 7) * 4 + "s";
      var lineOpacity = (0.08 + (i % 4) * 0.015).toFixed(3);

      // Glow duplicate first, so the crisp line renders on top of it.
      var glow = document.createElementNS("http://www.w3.org/2000/svg", "path");
      glow.setAttribute("class", "contour-glow");
      glow.setAttribute("d", d);
      glow.style.animationDuration = duration;
      glow.style.animationDelay = delay;
      frag.appendChild(glow);

      var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("class", "contour-line");
      path.setAttribute("d", d);
      path.style.opacity = lineOpacity;
      path.style.animationDuration = duration;
      path.style.animationDelay = delay;
      frag.appendChild(path);
    }

    contoursSvg.textContent = "";
    contoursSvg.appendChild(frag);
  }

  buildContours();
  window.addEventListener("load", buildContours);

  var resizeTimer = null;
  window.addEventListener(
    "resize",
    function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        buildContours();
        moveNavIndicator();
      }, 250);
    },
    { passive: true }
  );

  /* ------------------------------------------------ */
  /* Scroll: header state, progress, glow, sun         */
  /* ------------------------------------------------ */
  var scrollTicking = false;

  function updateScrollEffects() {
    var maxScroll = Math.max(root.scrollHeight - window.innerHeight, 1);
    var t = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);

    root.style.setProperty("--scroll-progress", t.toFixed(4));

    if (!reduceMotion) {
      var wave = (Math.sin(window.scrollY / 400) + 1) / 2;
      root.style.setProperty("--glow-strength", wave.toFixed(3));

      if (travelGlow) {
        // Raising the sine to an odd power makes it dwell near ±1 (the
        // screen edges) and sweep quickly through the middle, so the glow
        // spends most of its time clear of the centered text column. The
        // +PI/2 phase offset starts it at an edge (t=0, top of page)
        // instead of at the middle.
        var raw = Math.sin(t * Math.PI * 3 + Math.PI / 2);
        var shaped = (raw < 0 ? -1 : 1) * Math.pow(Math.abs(raw), 3);
        var xPercent = 50 + shaped * 40;
        var yPercent = 8 + t * 84 + Math.sin(t * Math.PI * 3.1) * 6;
        travelGlow.style.left = xPercent.toFixed(1) + "%";
        travelGlow.style.top = yPercent.toFixed(1) + "%";
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

  /* ------------------------------------------------ */
  /* Navigation                                        */
  /* ------------------------------------------------ */
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function moveNavIndicator() {
    if (!navIndicator) return;
    var active = nav.querySelector("a.is-active");
    if (!active) {
      navIndicator.style.setProperty("--nav-visible", "0");
      return;
    }
    navIndicator.style.setProperty("--nav-x", active.offsetLeft + "px");
    navIndicator.style.setProperty("--nav-w", active.offsetWidth + "px");
    navIndicator.style.setProperty("--nav-visible", "1");
  }

  if (sections.length && navLinks.length) {
    var sectionObserver = new IntersectionObserver(
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
  }

  // Hovering a nav link previews the indicator there; leaving snaps it back.
  if (navIndicator && finePointer) {
    navLinks.forEach(function (link) {
      link.addEventListener("mouseenter", function () {
        navIndicator.style.setProperty("--nav-x", link.offsetLeft + "px");
        navIndicator.style.setProperty("--nav-w", link.offsetWidth + "px");
        navIndicator.style.setProperty("--nav-visible", "1");
      });
    });
    nav.addEventListener("mouseleave", moveNavIndicator);
  }

  /* ------------------------------------------------ */
  /* Reveal on scroll (staggered per parent)           */
  /* ------------------------------------------------ */
  var revealTargets = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));

  function revealElement(el, delayMs) {
    el.style.setProperty("--reveal-delay", delayMs + "ms");
    el.classList.add("is-visible");
    // Hand transform/transition ownership back to the component's own
    // rules once the entrance is done (see the CSS comment on [data-reveal]).
    window.setTimeout(function () {
      el.removeAttribute("data-reveal");
      el.style.removeProperty("--reveal-delay");
    }, delayMs + 950);
  }

  if (revealTargets.length) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        // Elements entering in the same batch that share a parent get a
        // stagger, so grids ripple in instead of popping at once.
        var groups = new Map();
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
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
  }

  /* ------------------------------------------------ */
  /* Pointer: tilt + spotlight                         */
  /* ------------------------------------------------ */
  if (finePointer && !reduceMotion) {
    var tiltTargets = Array.prototype.slice.call(document.querySelectorAll(".tilt"));
    tiltTargets.forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var rect = el.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        var maxTilt = 5;
        el.style.setProperty("--tilt-x", (-py * maxTilt).toFixed(2) + "deg");
        el.style.setProperty("--tilt-y", (px * maxTilt).toFixed(2) + "deg");
      });
      el.addEventListener("pointerleave", function () {
        el.style.setProperty("--tilt-x", "0deg");
        el.style.setProperty("--tilt-y", "0deg");
      });
    });
  }

  if (finePointer) {
    var spotTargets = Array.prototype.slice.call(document.querySelectorAll(".card, .principle, .spotlight"));
    spotTargets.forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var rect = el.getBoundingClientRect();
        el.style.setProperty("--mx", (e.clientX - rect.left).toFixed(0) + "px");
        el.style.setProperty("--my", (e.clientY - rect.top).toFixed(0) + "px");
      });
    });
  }
})();
