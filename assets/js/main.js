(function () {
  "use strict";

  var header = document.getElementById("hlavicka");
  var nav = document.getElementById("hlavni-nav");
  var navToggle = document.getElementById("navToggle");
  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll("a")) : [];
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var yearEl = document.getElementById("rok");
  var contourSvg = document.querySelector(".page-contours svg");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // Header shadow/border once the page is scrolled, plus a slow parallax
  // drift of the background contour lines tied to scroll position.
  var parallaxTicking = false;

  function updateParallax() {
    if (contourSvg) {
      var offset = window.scrollY * 0.08;
      contourSvg.style.transform = "translateY(" + offset.toFixed(2) + "px)";
    }
    parallaxTicking = false;
  }

  function onScroll() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 4);
    }
    if (!reduceMotion && !parallaxTicking) {
      parallaxTicking = true;
      window.requestAnimationFrame(updateParallax);
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
