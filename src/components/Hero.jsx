import { useEffect, useRef } from "react";

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
      </div>
      <a className="scroll-cue hero-enter" style={{ "--enter-delay": "1.1s" }} href="#o-mne" aria-label="Posunout na obsah"><span></span></a>
    </section>
  );
}
