(function () {
  'use strict';

  var backdrop = document.getElementById('authBackdrop');
  var modal = document.getElementById('authModal');
  var closeBtn = document.getElementById('authClose');
  if (!backdrop || !modal) return;

  var tabs = modal.querySelectorAll('.auth-tab');
  var forms = modal.querySelectorAll('.auth-form');
  var lastFocused = null;

  function setTab(name) {
    tabs.forEach(function (t) {
      t.classList.toggle('is-active', t.getAttribute('data-tab') === name);
    });
    forms.forEach(function (f) {
      f.classList.toggle('is-active', f.getAttribute('data-form') === name);
    });
  }

  function open(tab) {
    lastFocused = document.activeElement;
    setTab(tab || 'login');
    backdrop.hidden = false;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    var firstInput = modal.querySelector('.auth-form.is-active input');
    if (firstInput) firstInput.focus();
  }

  function close() {
    backdrop.hidden = true;
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  document.querySelectorAll('[data-auth-open]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      open(btn.getAttribute('data-auth-open'));
    });
  });

  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) close();
  });

  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      setTab(t.getAttribute('data-tab'));
      var firstInput = modal.querySelector('.auth-form.is-active input');
      if (firstInput) firstInput.focus();
    });
  });

  forms.forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      // TODO: napojit skutečné přihlašování / registraci na backend.
      var btn = f.querySelector('button[type="submit"]');
      var original = btn.textContent;
      btn.textContent = 'Hotovo (demo) ✓';
      btn.disabled = true;
      setTimeout(function () {
        close();
        btn.textContent = original;
        btn.disabled = false;
        f.reset();
      }, 900);
    });
  });
})();
