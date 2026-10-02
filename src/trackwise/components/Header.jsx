import { useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { useScrollSpy } from "../hooks/useScrollSpy.js";

const BASE = import.meta.env.BASE_URL;
const NAV_LINKS = [
  { id: "uvod", label: "Úvod" },
  { id: "rezervace", label: "Rezervace" },
  { id: "merch", label: "Merch" },
];

export default function Header() {
  const { user, openAuthModal } = useAuth();
  const { count, openCart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const activeId = useScrollSpy(NAV_LINKS.map((l) => l.id));
  const themeBtnRef = useRef(null);

  function handleThemeClick() {
    toggleTheme();
    const btn = themeBtnRef.current;
    if (!btn) return;
    // Restart the pop animation even on rapid clicks (force a reflow).
    btn.classList.remove("is-pressed");
    void btn.offsetWidth;
    btn.classList.add("is-pressed");
  }

  return (
    <header className="site-header" id="siteHeader">
      <div className="site-header-inner">
        <a className="site-logo" href="#uvod">
          <img src={BASE + "assets/project/logo-tw.png"} alt="TrackWise — lekce závodního řízení" />
        </a>
        <nav className="site-nav" aria-label="Hlavní navigace">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a href={"#" + link.id} data-nav-link={link.id} className={activeId === link.id ? "is-active" : ""}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="site-header-actions">
          <button
            type="button"
            className="chrome-btn"
            id="cartTrigger"
            aria-haspopup="dialog"
            aria-controls="cartModal"
            aria-label="Košík"
            onClick={openCart}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 6h15l-1.5 9h-12z"></path>
              <path d="M6 6L4.5 3H2"></path>
              <circle cx="9.5" cy="20" r="1.4" fill="currentColor" stroke="none"></circle>
              <circle cx="17.5" cy="20" r="1.4" fill="currentColor" stroke="none"></circle>
            </svg>
            <span className="chrome-badge" id="cartBadge" hidden={count === 0}>{count}</span>
          </button>
          <button
            type="button"
            className={"chrome-btn" + (user ? " is-logged-in" : "")}
            id="authTrigger"
            data-auth-open="login"
            aria-haspopup="dialog"
            aria-controls="authModal"
            aria-label="Přihlásit se nebo založit profil"
            onClick={() => openAuthModal("login")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
          <button
            type="button"
            className="chrome-btn theme-toggle"
            id="themeToggle"
            aria-label="Přepnout světlý a tmavý režim"
            aria-pressed={theme === "light"}
            ref={themeBtnRef}
            onClick={handleThemeClick}
          >
            <svg className="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
            </svg>
            <svg className="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
