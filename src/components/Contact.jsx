export default function Contact() {
  return (
    <section className="section section--contact" id="kontakt" aria-labelledby="kontakt-heading">
      <div className="wrap section-grid">
        <h2 className="section-title" id="kontakt-heading">Kontakt</h2>
        <div className="section-content" data-reveal="true">
          <p className="contact-lede">
            Máš projekt, nabídku nebo si chceš jen popovídat o tom, jak stavět věci, které fungují?
          </p>
          <dl className="contact-list">
            <div className="contact-row">
              <dt>E-mail</dt>
              <dd><a className="link" href="mailto:adamsypt@seznam.cz">adamsypt@seznam.cz</a></dd>
            </div>
            <div className="contact-row">
              <dt>LinkedIn</dt>
              <dd>
                <a className="link" href="https://www.linkedin.com/in/adam-sypt%C3%A1k" target="_blank" rel="noopener noreferrer">
                  Adam Sypták<span aria-hidden="true"> ↗</span>
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <footer className="wrap site-footer">
        <p>© {new Date().getFullYear()} Adam Sypták</p>
        <nav aria-label="Patička">
          <a href="project/">Školní projekt<span aria-hidden="true"> ↗</span></a>
          <a href="#uvod">Nahoru<span aria-hidden="true"> ↑</span></a>
        </nav>
      </footer>
    </section>
  );
}
