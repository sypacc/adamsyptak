(function () {
  'use strict';

  var root = document.documentElement;
  var btn = document.getElementById('themeToggle');
  if (!btn) return;

  function stored() {
    try {
      return localStorage.getItem('tw-theme');
    } catch (e) {
      return null;
    }
  }

  function persist(theme) {
    try {
      localStorage.setItem('tw-theme', theme);
    } catch (e) {
      /* private mode / storage blocked — theme still applies for this load */
    }
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
    btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
  }

  apply(stored() === 'light' ? 'light' : 'dark');

  btn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    apply(next);
    persist(next);

    // "Haptika" — krátký hmatový pop efekt při přepnutí.
    btn.classList.remove('is-pressed');
    // force reflow, ať se animace dá znovu přehrát i při rychlém klikání
    void btn.offsetWidth;
    btn.classList.add('is-pressed');

    if (window.navigator && typeof window.navigator.vibrate === 'function') {
      window.navigator.vibrate(12);
    }
  });
})();
