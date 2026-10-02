import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useModalBehavior } from "../hooks/useModalBehavior.js";

export default function AuthModal() {
  const { user, login, logout, isAuthModalOpen, authModalTab, closeAuthModal, setAuthTab } = useAuth();
  useModalBehavior(isAuthModalOpen, closeAuthModal);

  const loginFormRef = useRef(null);
  const registerFormRef = useRef(null);
  const modalRef = useRef(null);
  const [pendingLabel, setPendingLabel] = useState(null);

  useEffect(() => {
    if (!isAuthModalOpen) return;
    const firstInput = modalRef.current && modalRef.current.querySelector(".auth-form.is-active input");
    if (firstInput) firstInput.focus();
  }, [isAuthModalOpen, authModalTab]);

  function handleSubmit(e, isRegister) {
    e.preventDefault();
    const form = e.target;
    const email = form.querySelector('input[type="email"]').value;
    const nameInput = form.querySelector('input[type="text"]');
    const name = isRegister && nameInput ? nameInput.value : email.split("@")[0];

    login({ name, email });

    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    setPendingLabel(isRegister ? "register" : "login");
    btn.textContent = "Hotovo ✓";
    window.setTimeout(() => {
      closeAuthModal();
      btn.textContent = original;
      form.reset();
      setPendingLabel(null);
    }, 700);
  }

  return (
    <>
      <div className="modal-backdrop" id="authBackdrop" hidden={!isAuthModalOpen} onClick={closeAuthModal}></div>
      <div
        className="auth-modal"
        id="authModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="authModalTitle"
        hidden={!isAuthModalOpen}
        ref={modalRef}
      >
        <button type="button" className="modal-close" id="authClose" aria-label="Zavřít" onClick={closeAuthModal}>×</button>
        <p className="auth-modal-title" id="authModalTitle">Tvůj účet</p>

        <div className="auth-guest" id="authGuestView" hidden={!!user}>
          <div className="auth-tabs">
            <button
              type="button"
              className={"auth-tab" + (authModalTab === "login" ? " is-active" : "")}
              data-tab="login"
              onClick={() => setAuthTab("login")}
            >
              Přihlásit se
            </button>
            <button
              type="button"
              className={"auth-tab" + (authModalTab === "register" ? " is-active" : "")}
              data-tab="register"
              onClick={() => setAuthTab("register")}
            >
              Založit profil
            </button>
          </div>
          <form
            className={"auth-form" + (authModalTab === "login" ? " is-active" : "")}
            data-form="login"
            ref={loginFormRef}
            onSubmit={(e) => handleSubmit(e, false)}
          >
            <label>E-mail<input type="email" required autoComplete="email" /></label>
            <label>Heslo<input type="password" required autoComplete="current-password" /></label>
            <button className="btn-primary" type="submit" disabled={pendingLabel === "register"}>Přihlásit se →</button>
          </form>
          <form
            className={"auth-form" + (authModalTab === "register" ? " is-active" : "")}
            data-form="register"
            ref={registerFormRef}
            onSubmit={(e) => handleSubmit(e, true)}
          >
            <label>Jméno<input type="text" required autoComplete="name" /></label>
            <label>E-mail<input type="email" required autoComplete="email" /></label>
            <label>Heslo<input type="password" required autoComplete="new-password" /></label>
            <button className="btn-primary" type="submit" disabled={pendingLabel === "login"}>Založit profil →</button>
          </form>
          <p className="auth-note">Zatím jen náhled UI bez skutečného přihlašování — napojíme, až bude backend.</p>
        </div>

        <div className="auth-logged-in" id="authLoggedInView" hidden={!user}>
          <p className="auth-welcome">Přihlášen(a) jako <strong id="authUserName">{user ? user.name : ""}</strong></p>
          <p className="auth-note">Tvoje údaje se teď při rezervaci vyplní automaticky.</p>
          <button className="btn-ghost" type="button" id="authLogout" onClick={logout}>Odhlásit se</button>
        </div>
      </div>
    </>
  );
}
