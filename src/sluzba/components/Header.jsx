import { useEffect, useState } from "react";
import { BRAND, NAV_LINKS } from "../content.js";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 16);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={"sl-header" + (isScrolled ? " is-scrolled" : "")}>
      <div className="sl-wrap sl-header-inner">
        <a className="sl-logo" href="#uvod">{BRAND}</a>
        <button
          className="sl-menu-btn"
          type="button"
          aria-expanded={isOpen}
          aria-controls="sl-nav"
          onClick={() => setIsOpen((v) => !v)}
        >
          {isOpen ? "Zavřít" : "Menu"}
        </button>
        <nav id="sl-nav" className={"sl-nav" + (isOpen ? " is-open" : "")} aria-label="Hlavní navigace">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a href={"#" + link.id} onClick={() => setIsOpen(false)}>{link.label}</a>
              </li>
            ))}
            <li><a href="../" className="sl-nav-back">Portfolio ↗</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
