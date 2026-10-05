import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";

const BASE = import.meta.env.BASE_URL;

const MERCH_ITEMS = [
  { id: "tricko", name: "Tričko TrackWise", price: 690, priceLabel: "690 Kč", alt: "Černé tričko s logem TrackWise" },
  { id: "mikina", name: "Mikina TrackWise", price: 1290, priceLabel: "1 290 Kč", alt: "Černá mikina s kapucí a logem TrackWise" },
  { id: "ksiltovka", name: "Kšiltovka TrackWise", price: 490, priceLabel: "490 Kč", alt: "Černá kšiltovka s vyšitým logem TrackWise" },
];

function merchSrcSet(id, ext) {
  return [500, 900].map((w) => `${BASE}assets/project/merch-${id}-${w}.${ext} ${w}w`).join(", ");
}

export default function Merch() {
  const { addMerchItem } = useCart();
  const [justAdded, setJustAdded] = useState(null);

  function handleAdd(item) {
    addMerchItem({ id: item.id, name: item.name, price: item.price });
    setJustAdded(item.id);
    window.setTimeout(() => setJustAdded((current) => (current === item.id ? null : current)), 1000);
  }

  return (
    <section className="merch" id="merch" aria-labelledby="merch-heading">
      <div className="booking-wrap">
        <div className="merch-intro">
          <p className="booking-eyebrow">Merch</p>
          <h2 id="merch-heading">Vybav se na trať</h2>
        </div>

        <div className="merch-grid">
          {MERCH_ITEMS.map((item) => (
            <article className="merch-card" key={item.id}>
              <div className="merch-visual">
                <picture>
                  <source type="image/avif" srcSet={merchSrcSet(item.id, "avif")} sizes="(max-width: 640px) 78vw, (max-width: 900px) 45vw, 360px" />
                  <img
                    src={`${BASE}assets/project/merch-${item.id}-900.webp`}
                    srcSet={merchSrcSet(item.id, "webp")}
                    sizes="(max-width: 640px) 78vw, (max-width: 900px) 45vw, 360px"
                    alt={item.alt}
                    width="900"
                    height="900"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>
              <h3>{item.name}</h3>
              <p className="merch-price">{item.priceLabel}</p>
              <button
                type="button"
                className="btn-primary merch-add"
                disabled={justAdded === item.id}
                onClick={() => handleAdd(item)}
              >
                {justAdded === item.id ? "Přidáno ✓" : "Přidat do košíku"}
              </button>
            </article>
          ))}
        </div>

        <p className="merch-note">E-shop napojíme v další fázi projektu.</p>
      </div>
    </section>
  );
}
