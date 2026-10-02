const BASE = import.meta.env.BASE_URL;

export default function Hero() {
  return (
    <section className="hero" id="uvod">
      <div className="hero-media" aria-hidden="true">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={BASE + "assets/project/hero-poster.jpg"}
        >
          <source src={BASE + "assets/project/hero-loop.mp4"} type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>
      </div>

      <div className="hero-content">
        <div className="hero-text">
          {/* TODO: doplnit finální claim */}
          <h1 className="hero-claim">Trénuj na okruhu jako profesionál.</h1>
          {/* TODO: doplnit finální benefit větu */}
          <p className="hero-benefit">
            Individuální trénink s instruktorem, který tě posune k rychlejším a jistějším časům.
          </p>

          <div className="hero-actions">
            {/* TODO: odkaz na rezervační wizard */}
            <a className="btn-primary" href="#rezervace">Rezervovat trénink</a>
            {/* TODO: napojit reálný e-shop, zatím jen odkaz do sekce */}
            <a className="btn-secondary" href="#merch">Merch</a>
          </div>

          <a className="hero-back" href="../">← Zpět na portfolio</a>
        </div>
      </div>
    </section>
  );
}
