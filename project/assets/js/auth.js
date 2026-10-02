(function () {
  'use strict';

  var AUTH_KEY = 'tw-auth';

  function loadUser() {
    try {
      return JSON.parse(localStorage.getItem(AUTH_KEY));
    } catch (e) {
      return null;
    }
  }

  function saveUser(user) {
    try { localStorage.setItem(AUTH_KEY, JSON.stringify(user)); } catch (e) { /* ignore */ }
  }

  function clearUser() {
    try { localStorage.removeItem(AUTH_KEY); } catch (e) { /* ignore */ }
  }

  var user = loadUser();

  var backdrop = document.getElementById('authBackdrop');
  var modal = document.getElementById('authModal');
  var closeBtn = document.getElementById('authClose');
  if (!backdrop || !modal) return;

  var trigger = document.getElementById('authTrigger');
  var guestView = document.getElementById('authGuestView');
  var loggedInView = document.getElementById('authLoggedInView');
  var userNameEl = document.getElementById('authUserName');
  var logoutBtn = document.getElementById('authLogout');

  var tabs = modal.querySelectorAll('.auth-tab');
  var forms = modal.querySelectorAll('.auth-form');
  var lastFocused = null;

  function renderAuthState() {
    var loggedIn = !!user;
    guestView.hidden = loggedIn;
    loggedInView.hidden = !loggedIn;
    if (trigger) trigger.classList.toggle('is-logged-in', loggedIn);
    if (loggedIn && userNameEl) userNameEl.textContent = user.name;
  }

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
    if (!user) setTab(tab || 'login');
    backdrop.hidden = false;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    var firstInput = modal.querySelector(':not([hidden]) .auth-form.is-active input');
    if (firstInput) firstInput.focus();
  }

  function close() {
    backdrop.hidden = true;
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  // Delegováno na document, protože tlačítka v kroku 2 rezervace se
  // po přihlášení/odhlášení překreslují (nová tlačítka, nové uzly).
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('[data-auth-open]');
    if (btn) open(btn.getAttribute('data-auth-open'));
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
      var isRegister = f.getAttribute('data-form') === 'register';
      var email = f.querySelector('input[type="email"]').value;
      var nameInput = f.querySelector('input[type="text"]');
      var name = isRegister && nameInput ? nameInput.value : email.split('@')[0];

      user = { name: name, email: email };
      saveUser(user);
      renderAuthState();
      window.dispatchEvent(new CustomEvent('tw-auth-changed', { detail: user }));

      var btn = f.querySelector('button[type="submit"]');
      var original = btn.textContent;
      btn.textContent = 'Hotovo ✓';
      setTimeout(function () {
        close();
        btn.textContent = original;
        f.reset();
      }, 700);
    });
  });

  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      user = null;
      clearUser();
      renderAuthState();
      window.dispatchEvent(new CustomEvent('tw-auth-changed', { detail: null }));
      close();
    });
  }

  renderAuthState();

  window.TWAuth = {
    getUser: function () { return user; }
  };
})();
