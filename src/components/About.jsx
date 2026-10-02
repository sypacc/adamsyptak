export default function About() {
  return (
    <section className="section" id="o-mne" aria-labelledby="o-mne-heading">
      <div className="wrap">
        <span className="section-watermark section-watermark--left" aria-hidden="true">01</span>
        <div className="about-layout">
          <div className="about-main">
            <p className="section-number" data-reveal="true">01</p>
            <h2 id="o-mne-heading" data-reveal="true">O mně</h2>
            <div className="section-body" data-reveal="true">
              <p>
                Od 2024 vedu{" "}
                <a className="inline-link" href="https://sportera.cz" target="_blank" rel="noopener noreferrer">Sportera ↗</a>
                {" "}– platformu, která dnes mapuje přes 1&nbsp;100 sportovišť ve více než 380 obcích po celé ČR.
              </p>
              <p>
                Byl jsem součástí vyjednávání spoluprací – například s <strong>Decathlonem</strong>,{" "}
                <strong>Českou spořitelnou</strong> nebo při zakládání startupu na VUT – a dohlížel jsem na
                znění a úpravu smluv. Dál se věnuju rozšiřování okruhu partnerů a klientů.
              </p>
              <p>
                Aktuálně jsem taky předseda a likvidátor Družstva Virtigo – vedl jsem jeho chod, teď řídím
                jeho řádné ukončení.
              </p>
            </div>
          </div>
          <figure className="about-photo" data-reveal="true">
            <img src={import.meta.env.BASE_URL + "assets/img/photos/adam-portrait.jpg"} alt="Portrét Adama Syptáka" width="2000" height="1333" loading="lazy" />
          </figure>
        </div>
      </div>
    </section>
  );
}
