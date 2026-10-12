const FACTS = [
  ["Teď", "Spoluzakladatel a CEO, Sportera Team s.r.o."],
  ["Paralelně", "Předseda a likvidátor, Družstvo Virtigo"],
  ["Studium", "Ing. Strategický rozvoj podniku, VUT Brno"],
  ["Zaměření", "Strategie, vedení týmu, partnerství a smlouvy, chod firmy"],
];

export default function About() {
  return (
    <section className="section" id="o-mne" aria-labelledby="o-mne-heading">
      <div className="wrap section-grid">
        <h2 className="section-title" id="o-mne-heading">O mně</h2>
        <div className="section-content" data-reveal="true">
          <div className="prose">
            <p className="prose-lead">
              Od 2024 vedu{" "}
              <a className="link" href="https://sportera.cz" target="_blank" rel="noopener noreferrer">Sportera</a>
              {" "}– platformu, která dnes mapuje 2&nbsp;526 venkovních hřišť v 856 obcích po celé ČR, kam se dá přijít bez rezervace.
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

          <dl className="facts" aria-label="Ve zkratce">
            {FACTS.map(([k, v]) => (
              <div className="facts-row" key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
