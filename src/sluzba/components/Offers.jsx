import { OFFERS } from "../content.js";

export default function Offers() {
  return (
    <section className="sl-section" id="nabidka" aria-labelledby="nabidka-heading">
      <div className="sl-wrap">
        <h2 className="sl-heading" id="nabidka-heading">Nabídka</h2>
        <div className="sl-offers">
          {OFFERS.map((offer) => (
            <article key={offer.id} className={"sl-offer" + (offer.featured ? " is-featured" : "")}>
              {offer.featured && <span className="sl-offer-badge">Nejoblíbenější</span>}
              <h3 className="sl-offer-name">{offer.name}</h3>
              <p className="sl-offer-price">{offer.price}</p>
              <p className="sl-offer-desc">{offer.desc}</p>
              <ul className="sl-offer-features">
                {offer.features.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
              <a className={"sl-btn" + (offer.featured ? " sl-btn--primary" : "")} href={"#objednavka"} data-offer={offer.id}>
                Vybrat
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
