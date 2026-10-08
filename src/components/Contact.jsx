import SplitHeading from "./SplitHeading.jsx";
import Magnetic from "./Magnetic.jsx";

export default function Contact() {
  return (
    <section className="section contact-section" id="kontakt" aria-labelledby="kontakt-heading">
      <div className="wrap">
        <span className="section-watermark" aria-hidden="true">05</span>
        <div className="contact-layout">
          <div className="contact-intro">
            <p className="section-number" data-reveal="true">05</p>
            <SplitHeading id="kontakt-heading" text="Kontakt" />
            <p className="contact-lede" data-reveal="true">
              Máš projekt, nabídku nebo si chceš jen popovídat o tom, jak stavět věci, které <span className="accent">fungují</span>?
            </p>
          </div>
          <div className="contact-links">
            <Magnetic strength={0.08}>
              <a className="contact-link contact-link--primary" data-reveal="true" href="mailto:adamsypt@seznam.cz" data-contact="email">
                <span className="contact-label">E-mail</span>
                <span className="contact-value">adamsypt@seznam.cz</span>
                <svg className="contact-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>
            </Magnetic>
            <Magnetic strength={0.08}>
              <a className="contact-link" data-reveal="true" href="https://www.linkedin.com/in/adam-sypt%C3%A1k" target="_blank" rel="noopener noreferrer" data-contact="linkedin">
                <span className="contact-label">LinkedIn</span>
                <span className="contact-value">Adam Sypták</span>
                <svg className="contact-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>
            </Magnetic>
          </div>
        </div>

        <div className="contact-meta">
          <p>© {new Date().getFullYear()} Adam Sypták</p>
          <a href="project/" className="contact-meta-link">Školní projekt ↗</a>
          <a href="#uvod" className="contact-meta-link to-top">Nahoru ↑</a>
        </div>
      </div>
    </section>
  );
}
