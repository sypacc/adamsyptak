import { BRAND } from "../content.js";

export default function Footer() {
  return (
    <footer className="sl-footer">
      <div className="sl-wrap sl-footer-inner">
        <p>© {new Date().getFullYear()} {BRAND} — školní projekt</p>
        <a href="../">← Zpět na portfolio</a>
      </div>
    </footer>
  );
}
