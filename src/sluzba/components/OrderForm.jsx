import { useState } from "react";
import { OFFERS } from "../content.js";

// Demo formulář — nic se neodesílá, jen se ukáže potvrzení.
export default function OrderForm() {
  const [sent, setSent] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setSent(data);
  }

  return (
    <section className="sl-section" id="objednavka" aria-labelledby="objednavka-heading">
      <div className="sl-wrap sl-order">
        <div>
          <h2 className="sl-heading" id="objednavka-heading">Objednávka</h2>
          <p className="sl-muted">Vyplň pár údajů a ozveme se ti s potvrzením.</p>
        </div>

        {sent ? (
          <div className="sl-order-done" role="status">
            <p className="sl-order-done-title">Díky, {sent.name}!</p>
            <p className="sl-muted">Objednávku varianty „{OFFERS.find((o) => o.id === sent.offer)?.name}“ jsme přijali. Potvrzení pošleme na {sent.email}.</p>
            <button className="sl-btn" type="button" onClick={() => setSent(null)}>Nová objednávka</button>
          </div>
        ) : (
          <form className="sl-form" onSubmit={handleSubmit}>
            <label>
              <span>Varianta</span>
              <select name="offer" defaultValue="standard" required>
                {OFFERS.map((o) => <option key={o.id} value={o.id}>{o.name} — {o.price}</option>)}
              </select>
            </label>
            <label>
              <span>Jméno</span>
              <input name="name" type="text" autoComplete="name" required />
            </label>
            <label>
              <span>E-mail</span>
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label>
              <span>Termín</span>
              <input name="date" type="date" required />
            </label>
            <label className="sl-form-full">
              <span>Poznámka</span>
              <textarea name="note" rows="3" />
            </label>
            <button className="sl-btn sl-btn--primary sl-form-full" type="submit">Odeslat objednávku</button>
          </form>
        )}
      </div>
    </section>
  );
}
