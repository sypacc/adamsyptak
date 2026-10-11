import SplitHeading from "./SplitHeading.jsx";

export default function Thinking() {
  return (
    <section className="section" id="mysleni" aria-labelledby="mysleni-heading">
      <div className="wrap">
        <span className="section-watermark" aria-hidden="true">03</span>
        <p className="section-number" data-reveal="true">03</p>
        <SplitHeading id="mysleni-heading" text="Jak přemýšlím" />

        <div className="principles">
          <div className="principle tilt" data-reveal="true">
            <span className="principle-index">01</span>
            <h3>Rozhoduju bez čekání na mandát</h3>
            <p>
              Organizační strukturu Virtiga i partnerství s ČS jsem stavěl dřív, než k tomu existovala
              formální pozice. Věřím, že aktivní práce a proaktivní přístup jsou zásadní metrikou úspěchu.
            </p>
          </div>

          <div className="principle tilt" data-reveal="true">
            <span className="principle-index">02</span>
            <h3>Na nevýhodnou nabídku reaguju protinávrhem</h3>
            <p>
              Byl jsem a nadále budu součástí všech vyjednávání, ať už se týkají Sportery nebo jiných
              projektů, a dokážu aktivně kontrolovat i upravovat partnerství i nároky jednotlivých stran.
              Věřím, že jasná komunikace je základ úspěchu.
            </p>
          </div>

          <div className="principle tilt" data-reveal="true">
            <span className="principle-index">03</span>
            <h3>Chybu řeším jako proces</h3>
            <p>
              Rozhodnutí, která nevyšla, si zpětně rozeberu – co jsem věděl a co jsem přehlédl.
            </p>
          </div>

          <div className="principle tilt" data-reveal="true">
            <span className="principle-index">04</span>
            <h3>Rozhoduju na základě dat, ne dojmu</h3>
            <p>
              Produktová rozhodnutí (onboarding, retence) stavím na metrikách, které sám navrhuju a
              sleduju.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
