import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "motion/react";
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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleThemeClick() {
    const btn = themeBtnRef.current;
    const rect = btn.getBoundingClientRect();
    toggleTheme({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    // Restart the pop animation even on rapid clicks (force a reflow).
    btn.classList.remove("is-pressed");
    void btn.offsetWidth;
    btn.classList.add("is-pressed");
  }

  return (
    <header className={"site-header" + (isScrolled ? " is-scrolled" : "")} id="siteHeader">
      <div className="site-header-inner">
        <a className="site-logo" href="#uvod" aria-label="TrackWise — úvod">
          <img src={BASE + "assets/project/logo-tw-200.webp"} srcSet={`${BASE}assets/project/logo-tw-200.webp 200w, ${BASE}assets/project/logo-tw-400.webp 400w`} sizes="85px" alt="" width="85" height="30" />
        </a>
        <nav className="site-nav" aria-label="Hlavní navigace">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={"#" + link.id}
                  data-nav-link={link.id}
                  className={activeId === link.id ? "is-active" : ""}
                  aria-current={activeId === link.id ? "location" : undefined}
                >
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
            aria-label={count > 0 ? `Košík, ${count} položek` : "Košík"}
            onClick={openCart}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 6h15l-1.5 9h-12z"></path>
              <path d="M6 6L4.5 3H2"></path>
              <circle cx="9.5" cy="20" r="1.4" fill="currentColor" stroke="none"></circle>
              <circle cx="17.5" cy="20" r="1.4" fill="currentColor" stroke="none"></circle>
            </svg>
            <AnimatePresence>
              {count > 0 && (
                <m.span
                  key="badge"
                  className="chrome-badge"
                  id="cartBadge"
                  aria-hidden="true"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0, transition: { duration: 0.15 } }}
                >
                  {/* Re-keyed per count so every change gives the number a bump. */}
                  <m.span
                    key={count}
                    style={{ display: "inline-block" }}
                    initial={{ scale: 1.8 }}
                    animate={{ scale: 1, transition: { type: "spring", stiffness: 520, damping: 14 } }}
                  >
                    {count}
                  </m.span>
                </m.span>
              )}
            </AnimatePresence>
          </button>
          <button
            type="button"
            className={"chrome-btn" + (user ? " is-logged-in" : "")}
            id="authTrigger"
            aria-haspopup="dialog"
            aria-label={user ? `Účet: ${user.name}` : "Přihlásit se nebo založit profil"}
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
