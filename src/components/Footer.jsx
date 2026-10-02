export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <p>© <span id="rok">{new Date().getFullYear()}</span> Adam Sypták</p>
        <div className="footer-links">
          <a href="project/" className="footer-link">Školní projekt ↗</a>
          <a href="#uvod" className="to-top">Nahoru ↑</a>
        </div>
      </div>
    </footer>
  );
}
