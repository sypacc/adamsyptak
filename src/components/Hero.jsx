import { useEffect, useRef } from "react";
import Magnetic from "./Magnetic.jsx";
import ResponsivePicture from "./ResponsivePicture.jsx";

const STATS = [
  { label: "Sportovišť na mapě", value: "1\u00a0100+" },
  { label: "Zapojených obcí", value: "380+" },
  { label: "TAFISA World Congress", value: "Řečník", small: "2026" },
  { label: "Sportera", value: "od 2024" },
];

export default function Hero() {
  const heroRef = useRef(null);
  const nameRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const name = nameRef.current;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!hero || !name || !finePointer || reduceMotion) return undefined;

    const words = Array.from(name.querySelectorAll(".word > span"));
    let frame = 0;
    let lastEvent = null;

    function paint() {
      frame = 0;
      words.forEach((el) => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--hx", (lastEvent.clientX - rect.left).toFixed(0) + "px");
        el.style.setProperty("--hy", (lastEvent.clientY - rect.top).toFixed(0) + "px");
      });
    }

    function onMove(e) {
      lastEvent = e;
      name.classList.add("is-lit");
      if (!frame) frame = requestAnimationFrame(paint);
    }

    function onLeave() {
      name.classList.remove("is-lit");
    }

    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section className="hero" id="uvod" ref={heroRef}>
      <div className="wrap hero-inner">
        <div className="hero-layout">
          <div className="hero-text">
            <p className="hero-eyebrow hero-enter" style={{ "--enter-delay": "0.1s" }}>
              <span className="hero-dot" aria-hidden="true"></span>
              Spoluzakladatel &amp; Business Lead · Sportera
            </p>
            <h1 className="hero-name" ref={nameRef}>
              <span className="word"><span>Adam</span></span>{" "}
              <span className="word"><span>Sypták</span></span>
            </h1>
            <p className="hero-tagline hero-enter" style={{ "--enter-delay": "0.45s" }}>
              Buduji věci od nuly a dotahuju je do stavu, kdy <span className="accent">fungují</span>.
            </p>
            <p className="hero-lede hero-enter" style={{ "--enter-delay": "0.6s" }}>
              Partnerství, produkt a provoz civic-tech platformy, která mapuje veřejná sportoviště po celé ČR.
            </p>
            <div className="hero-actions hero-enter" style={{ "--enter-delay": "0.75s" }}>
              <Magnetic>
                <a className="btn btn--primary" href="#kontakt">
                  Napiš mi
                  <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
              </Magnetic>
              <Magnetic>
                <a className="btn btn--ghost" href="#postaveno">Co jsem postavil</a>
              </Magnetic>
            </div>
          </div>

          <figure className="hero-photo hero-enter" style={{ "--enter-delay": "0.3s" }}>
            <ResponsivePicture
              name="adam-portrait"
              widths={[800, 1400]}
              sizes="(max-width: 899px) 420px, 720px"
              alt="Portrét Adama Syptáka"
              width="2000"
              height="1333"
              loading="eager"
            />
            <figcaption className="hero-badge">
              <strong>1. místo</strong>
              <span>Změň svět pohybem 2025</span>
            </figcaption>
          </figure>
        </div>

        <dl className="hero-stats hero-enter" style={{ "--enter-delay": "0.95s" }}>
          {STATS.map((s) => (
            <div className="stat" key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}{s.small ? <small> {s.small}</small> : null}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
