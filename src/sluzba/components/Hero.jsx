import { HERO } from "../content.js";

export default function Hero() {
  return (
    <section className="sl-hero" id="uvod">
      <div className="sl-wrap">
        <p className="sl-eyebrow">{HERO.eyebrow}</p>
        <h1 className="sl-hero-title">{HERO.title}</h1>
        <p className="sl-hero-lede">{HERO.lede}</p>
        <div className="sl-hero-actions">
          <a className="sl-btn sl-btn--primary" href="#objednavka">{HERO.cta}</a>
          <a className="sl-btn" href="#nabidka">Prohlédnout nabídku</a>
        </div>
      </div>
    </section>
  );
}
