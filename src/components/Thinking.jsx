const PRINCIPLES = [
  {
    title: "Rozhoduju bez čekání na mandát",
    text:
      "Organizační strukturu Virtiga i partnerství s ČS jsem stavěl dřív, než k tomu existovala formální pozice. Věřím, že aktivní práce a proaktivní přístup jsou zásadní metrikou úspěchu.",
  },
  {
    title: "Na nevýhodnou nabídku reaguju protinávrhem",
    text:
      "Byl jsem a nadále budu součástí všech vyjednávání, ať už se týkají Sportery nebo jiných projektů, a dokážu aktivně kontrolovat i upravovat partnerství i nároky jednotlivých stran. Věřím, že jasná komunikace je základ úspěchu.",
  },
  {
    title: "Chybu řeším jako proces",
    text: "Rozhodnutí, která nevyšla, si zpětně rozeberu – co jsem věděl a co jsem přehlédl.",
  },
  {
    title: "Rozhoduju na základě dat, ne dojmu",
    text: "Produktová rozhodnutí (onboarding, retence) stavím na metrikách, které sám navrhuju a sleduju.",
  },
];

export default function Thinking() {
  return (
    <section className="section" id="mysleni" aria-labelledby="mysleni-heading">
      <div className="wrap section-grid">
        <h2 className="section-title" id="mysleni-heading">Jak přemýšlím</h2>
        <ol className="section-content principles" data-reveal="true">
          {PRINCIPLES.map((p, i) => (
            <li className="principle" key={p.title}>
              <span className="principle-index" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <div className="principle-body">
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
