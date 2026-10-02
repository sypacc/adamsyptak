export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-wrap">
        <div className="footer-grid">
          <div className="footer-col">
            <p className="footer-brand">TrackWise</p>
            <p className="footer-tagline">Individuální tréninky na okruhu s instruktorem — pro začátečníky i pokročilé.</p>
          </div>
          <div className="footer-col">
            <p className="footer-col-title">Kontakt</p>
            <ul>
              {/* TODO: doplnit skutečné kontaktní údaje */}
              <li><a href="tel:+420000000000">+420 000 000 000</a></li>
              <li><a href="mailto:info@example.cz">info@example.cz</a></li>
              <li>Autodrom, Most</li>
            </ul>
          </div>
          <div className="footer-col">
            <p className="footer-col-title">Rychlé odkazy</p>
            <ul>
              <li><a href="#uvod">Úvod</a></li>
              <li><a href="#rezervace">Rezervace</a></li>
              <li><a href="#merch">Merch</a></li>
              <li><a href="../">Portfolio</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <p className="footer-col-title">Sociální sítě</p>
            <ul>
              {/* TODO: doplnit skutečné odkazy */}
              <li><a href="#">Instagram</a></li>
              <li><a href="#">Facebook</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© <span id="footerRok">{new Date().getFullYear()}</span> TrackWise — školní projekt</p>
          <a href="../">← Zpět na portfolio</a>
        </div>
      </div>
    </footer>
  );
}
