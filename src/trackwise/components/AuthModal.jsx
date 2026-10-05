import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import Modal from "./Modal.jsx";

const TABS = [
  { id: "login", label: "Přihlásit se" },
  { id: "register", label: "Založit profil" },
];

export default function AuthModal() {
  const { user, login, logout, isAuthModalOpen, authModalTab, closeAuthModal, setAuthTab } = useAuth();
  const closeTimer = useRef(0);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  function handleSubmit(e, isRegister) {
    e.preventDefault();
    // TODO: napojit skutečné přihlašování / registraci na backend.
    const form = e.target;
    const email = form.elements.email.value;
    const name = isRegister ? form.elements.name.value : email.split("@")[0];
    login({ name, email });
    // The dialog flips to the signed-in view; leave it up briefly as the
    // confirmation, then close.
    closeTimer.current = window.setTimeout(closeAuthModal, 900);
  }

  function handleTabKey(e) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const next = authModalTab === "login" ? "register" : "login";
    setAuthTab(next);
    document.getElementById("authTab-" + next)?.focus();
  }

  return (
    <Modal isOpen={isAuthModalOpen} onClose={closeAuthModal} id="authModal" labelledBy="authModalTitle">
      <p className="auth-modal-title" id="authModalTitle">Tvůj účet</p>

      {!user ? (
        <div className="auth-guest" id="authGuestView">
          <div className="auth-tabs" role="tablist" aria-label="Přihlášení nebo registrace">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={"authTab-" + tab.id}
                aria-selected={authModalTab === tab.id}
                aria-controls={"authPanel-" + tab.id}
                tabIndex={authModalTab === tab.id ? 0 : -1}
                className={"auth-tab" + (authModalTab === tab.id ? " is-active" : "")}
                data-tab={tab.id}
                onClick={() => setAuthTab(tab.id)}
                onKeyDown={handleTabKey}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {authModalTab === "login" ? (
            <form
              key="login"
              className="auth-form is-active"
              data-form="login"
              role="tabpanel"
              id="authPanel-login"
              aria-labelledby="authTab-login"
              onSubmit={(e) => handleSubmit(e, false)}
            >
              <label>E-mail<input name="email" type="email" required autoComplete="email" data-autofocus /></label>
              <label>Heslo<input name="password" type="password" required autoComplete="current-password" /></label>
              <button className="btn-primary" type="submit">Přihlásit se →</button>
            </form>
          ) : (
            <form
              key="register"
              className="auth-form is-active"
              data-form="register"
              role="tabpanel"
              id="authPanel-register"
              aria-labelledby="authTab-register"
              onSubmit={(e) => handleSubmit(e, true)}
            >
              <label>Jméno<input name="name" type="text" required autoComplete="name" data-autofocus /></label>
              <label>E-mail<input name="email" type="email" required autoComplete="email" /></label>
              <label>Heslo<input name="password" type="password" required autoComplete="new-password" /></label>
              <button className="btn-primary" type="submit">Založit profil →</button>
            </form>
          )}
          <p className="auth-note">Zatím jen náhled UI bez skutečného přihlašování — napojíme, až bude backend.</p>
        </div>
      ) : (
        <div className="auth-logged-in" id="authLoggedInView">
          <p className="auth-welcome">Přihlášen(a) jako <strong id="authUserName">{user.name}</strong></p>
          <p className="auth-note">Tvoje údaje se teď při rezervaci vyplní automaticky.</p>
          <button className="btn-ghost" type="button" id="authLogout" onClick={() => { logout(); closeAuthModal(); }}>Odhlásit se</button>
        </div>
      )}
    </Modal>
  );
}
