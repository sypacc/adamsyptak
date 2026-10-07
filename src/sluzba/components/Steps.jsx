import { STEPS } from "../content.js";

export default function Steps() {
  return (
    <section className="sl-section sl-section--alt" id="postup" aria-labelledby="postup-heading">
      <div className="sl-wrap">
        <h2 className="sl-heading" id="postup-heading">Jak to funguje</h2>
        <ol className="sl-steps">
          {STEPS.map((step, i) => (
            <li key={i} className="sl-step">
              <span className="sl-step-num">{String(i + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
