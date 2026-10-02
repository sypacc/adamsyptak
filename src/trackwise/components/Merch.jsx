import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";

const BASE = import.meta.env.BASE_URL;

const MERCH_ITEMS = [
  {
    id: "tricko",
    name: "Tričko TrackWise",
    price: 690,
    priceLabel: "690 Kč",
    logoClass: "merch-logo",
    icon: (
      <path d="M40 14 L20 26 L10 44 L26 54 L30 48 L30 108 L90 108 L90 48 L94 54 L110 44 L100 26 L80 14 C80 22 70 28 60 28 C50 28 40 22 40 14Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
    ),
  },
  {
    id: "mikina",
    name: "Mikina TrackWise",
    price: 1290,
    priceLabel: "1 290 Kč",
    logoClass: "merch-logo",
    icon: (
      <>
        <path d="M38 12 L18 24 L8 42 L24 52 L28 46 L28 108 L92 108 L92 46 L96 52 L112 42 L102 24 L82 12 C82 12 78 24 60 24 C42 24 38 12 38 12Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M50 24 C50 34 70 34 70 24" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="M60 24 L60 46" fill="none" stroke="currentColor" strokeWidth="2" />
      </>
    ),
  },
  {
    id: "ksiltovka",
    name: "Kšiltovka TrackWise",
    price: 490,
    priceLabel: "490 Kč",
    logoClass: "merch-logo merch-logo--cap",
    icon: (
      <>
        <path d="M14 66 C14 40 35 24 60 24 C85 24 106 40 106 66 L94 66 C94 48 79 36 60 36 C41 36 26 48 26 66Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M14 66 C14 76 24 80 36 80 L94 80 C102 80 106 74 106 66" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M94 66 L112 70 L108 78 L94 76Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      </>
    ),
  },
];

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
                <svg viewBox="0 0 120 120" aria-hidden="true">{item.icon}</svg>
                <img src={BASE + "assets/project/logo-tw.png"} alt="" className={item.logoClass} />
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

        <p className="merch-note">Ukázkové kousky — reálné fotky a e-shop napojíme v další fázi projektu.</p>
      </div>
    </section>
  );
}
