export default function Hero() {
  return (
    <section className="hero" id="uvod">
      <div className="wrap">
        <h1 className="hero-name">
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
