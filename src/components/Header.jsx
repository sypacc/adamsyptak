import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { href: "#o-mne", label: "O mně" },
  { href: "#postaveno", label: "Co jsem postavil" },
  { href: "#mysleni", label: "Jak přemýšlím" },
  { href: "#vzdelani", label: "Vzdělání" },
  { href: "#kontakt", label: "Kontakt" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef(null);

  // The small-screen menu is a plain list under the header bar: Escape and a
  // click anywhere outside close it, like any disclosure.
  useEffect(() => {
    if (!isOpen) return undefined;
    function onKeyDown(e) {
      if (e.key === "Escape") setIsOpen(false);
    }
    function onPointerDown(e) {
      if (headerRef.current && !headerRef.current.contains(e.target)) setIsOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isOpen]);

  return (
    <header className={"site-header" + (isOpen ? " is-open" : "")} ref={headerRef}>
      <div className="wrap header-inner">
        <a className="wordmark" href="#uvod">Adam Sypták</a>

        <nav className="nav" id="hlavni-nav" aria-label="Hlavní navigace">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setIsOpen(false)}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={isOpen}
          aria-controls="hlavni-nav"
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? "Zavřít" : "Menu"}
        </button>
      </div>
    </header>
  );
}
