import { useEffect, useState } from "react";

var NAV_LINKS = [
  { href: "#o-mne", label: "O mně" },
  { href: "#postaveno", label: "Co jsem postavil" },
  { href: "#mysleni", label: "Jak přemýšlím" },
  { href: "#vzdelani", label: "Vzdělání" },
  { href: "#kontakt", label: "Kontakt" },
];

export default function Header({ headerRef, navRef, navIndicatorRef }) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  // The mobile menu is a full-screen overlay: lock the page behind it and
  // let Escape close it like any other dialog.
  useEffect(() => {
    if (!isNavOpen) return undefined;
    document.body.style.overflow = "hidden";
    function onKeyDown(e) {
      if (e.key === "Escape") setIsNavOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isNavOpen]);

  function closeNav() {
    setIsNavOpen(false);
  }

  return (
    <header className="site-header" id="hlavicka" ref={headerRef}>
      <div className="wrap header-inner">
        <a className="logo" href="#uvod" aria-label="AS — Adam Sypták, úvod">AS</a>

        <nav
          className={"nav" + (isNavOpen ? " is-open" : "")}
          id="hlavni-nav"
          aria-label="Hlavní navigace"
          ref={navRef}
          data-lenis-prevent={isNavOpen ? "" : undefined}
        >
          <ul id="navList">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={closeNav}>{link.label}</a>
              </li>
            ))}
            <li className="nav-indicator" id="navIndicator" aria-hidden="true" ref={navIndicatorRef}></li>
          </ul>
        </nav>

        <button
          type="button"
          className="nav-toggle"
          id="navToggle"
          aria-expanded={isNavOpen}
          aria-controls="hlavni-nav"
          aria-label={isNavOpen ? "Zavřít navigaci" : "Otevřít navigaci"}
          onClick={() => setIsNavOpen((open) => !open)}
        >
          <span></span><span></span><span></span>
        </button>
      </div>
      <span className="scroll-progress" aria-hidden="true"></span>
    </header>
  );
}
