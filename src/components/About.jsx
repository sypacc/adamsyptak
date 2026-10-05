import SplitHeading from "./SplitHeading.jsx";

const FACTS = [
  ["Teď", "Spoluzakladatel & Business Lead, Sportera Team s.r.o."],
  ["Paralelně", "Předseda a likvidátor, Družstvo Virtigo"],
  ["Studium", "Ing. Strategický rozvoj podniku, VUT Brno"],
  ["Zaměření", "Strategie, vedení týmu, partnerství a smlouvy, chod firmy"],
];

export default function About() {
  return (
    <section className="section" id="o-mne" aria-labelledby="o-mne-heading">
      <div className="wrap">
        <span className="section-watermark" aria-hidden="true">01</span>
        <div className="about-layout">
          <div className="about-main">
            <p className="section-number" data-reveal="true">01</p>
            <SplitHeading id="o-mne-heading" text="O mně" />
            <div className="section-body" data-reveal="true">
              <p>
                Od 2024 vedu{" "}
                <a className="inline-link" href="https://sportera.cz" target="_blank" rel="noopener noreferrer">Sportera ↗</a>
                {" "}– platformu, která dnes mapuje přes 1&nbsp;100 sportovišť ve více než 380 obcích po celé ČR.
              </p>
              <p>
                Ve Sporteře mám na starosti strategii, vedení týmu a celý chod firmy – od partnerů a smluv
                po komunikaci s účetní.
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
          <aside className="facts" data-reveal="true" aria-label="Ve zkratce">
            <p className="facts-title">Ve zkratce</p>
            <dl>
              {FACTS.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </div>
    </section>
  );
}
