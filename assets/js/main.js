(function () {
  "use strict";

  var header = document.getElementById("hlavicka");
  var nav = document.getElementById("hlavni-nav");
  var navToggle = document.getElementById("navToggle");
  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll("a")) : [];
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var yearEl = document.getElementById("rok");
  var contoursEl = document.getElementById("pageContours");
  var contoursSvg = document.getElementById("contoursSvg");
  var travelGlow = document.getElementById("travelGlow");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

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
    var pageHeight = Math.max(document.documentElement.scrollHeight, window.innerHeight);
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
      resizeTimer = window.setTimeout(buildContours, 250);
    },
    { passive: true }
  );

  // Header shadow/border once the page is scrolled, plus a glow intensity
  // on the contour lines that gently rises and falls as you scroll down
  // (the lines themselves keep wiggling independently via CSS), and a
  // large ambient glow that wanders around the page as you scroll,
  // staying mostly out near the left/right edges so it doesn't sit
  // behind the text column.
  var glowTicking = false;

  function updateGlow() {
    var wave = (Math.sin(window.scrollY / 400) + 1) / 2;
    document.documentElement.style.setProperty("--glow-strength", wave.toFixed(3));

    if (travelGlow) {
      var doc = document.documentElement;
      var maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);
      var t = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);

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

    glowTicking = false;
  }

  function onScroll() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 4);
    }
    if (!reduceMotion && !glowTicking) {
      glowTicking = true;
      window.requestAnimationFrame(updateGlow);
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile nav toggle
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

  // Active nav link on scroll
  if (sections.length && navLinks.length) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.getAttribute("id");
          navLinks.forEach(function (link) {
            var matches = link.getAttribute("href") === "#" + id;
            link.classList.toggle("is-active", matches);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  // Reveal-on-scroll for elements marked with data-reveal
  var revealTargets = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if (revealTargets.length) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // Pointer-following tilt on cards/tiles, only for mouse-like pointers
  // that don't already get a touch/scroll experience from the browser.
  var canTilt =
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (canTilt) {
    var tiltTargets = Array.prototype.slice.call(document.querySelectorAll(".card, .principle"));
    tiltTargets.forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var rect = el.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        var maxTilt = 6;
        el.style.setProperty("--tilt-x", (-py * maxTilt).toFixed(2) + "deg");
        el.style.setProperty("--tilt-y", (px * maxTilt).toFixed(2) + "deg");
      });
      el.addEventListener("pointerleave", function () {
        el.style.setProperty("--tilt-x", "0deg");
        el.style.setProperty("--tilt-y", "0deg");
      });
    });
  }
})();
