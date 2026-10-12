import ResponsivePicture from "./ResponsivePicture.jsx";

const FIGURES = [
  { value: "2 526", label: "hřišť na mapě" },
  { value: "856", label: "obcí" },
  { value: "11", label: "sportů" },
];

const PARTNERS = ["Česká spořitelna", "Decathlon", "KPMG", "Startup VUT"];

export default function Hero() {
  return (
    <section className="intro" id="uvod" aria-labelledby="uvod-heading">
      <div className="wrap">
        <div className="intro-grid">
          <div className="intro-text">
            <p className="intro-kicker enter" style={{ "--i": 0 }}>
              Spoluzakladatel a CEO, Sportera Team
            </p>
            <h1 className="intro-title enter" id="uvod-heading" style={{ "--i": 1 }}>
              Buduji věci od nuly a dotahuju je do&nbsp;stavu, kdy fungují.
            </h1>
            <p className="intro-lede enter" style={{ "--i": 2 }}>
              Partnerství, produkt a provoz civic-tech platformy, která mapuje veřejná
              sportoviště po celé ČR.
            </p>
            <div className="intro-actions enter" style={{ "--i": 3 }}>
              <a className="button" href="mailto:adamsypt@seznam.cz">Napsat e-mail</a>
              <a className="text-link" href="#postaveno">Co jsem postavil<span aria-hidden="true"> ↓</span></a>
            </div>
          </div>

          <figure className="intro-photo enter" style={{ "--i": 1 }}>
            <ResponsivePicture
              name="adam-portrait"
              widths={[800, 1400]}
              sizes="(min-width: 900px) 420px, calc(100vw - 2.5rem)"
              alt="Portrét Adama Syptáka"
              width="2000"
              height="1333"
              loading="eager"
            />
          </figure>
        </div>

        <dl className="figures enter" style={{ "--i": 4 }} aria-label="Sportera v číslech">
          {FIGURES.map((f) => (
            <div className="figure" key={f.label}>
              <dd>{f.value}</dd>
              <dt>{f.label}</dt>
            </div>
          ))}
          <div className="figure figure--text">
            <dt>Spolupráce</dt>
            <dd>{PARTNERS.join(", ")}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
