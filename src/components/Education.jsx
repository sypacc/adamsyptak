import SplitHeading from "./SplitHeading.jsx";

export default function Education() {
  return (
    <section className="section section--light" id="vzdelani" aria-labelledby="vzdelani-heading">
      <div className="wrap">
        <span className="section-watermark" aria-hidden="true">04</span>
        <div className="split">
          <div className="split-head">
            <p className="section-number" data-reveal="true">04</p>
            <SplitHeading id="vzdelani-heading" text="Vzdělání" />
          </div>

        <div className="timeline" data-reveal="true">
          <div className="timeline-item" data-reveal="true">
            <h3>Bc. Entrepreneurial and Small Business Development</h3>
            <p className="timeline-meta">VUT Brno · 2022–2025 · studováno a obhájeno v angličtině</p>
            <p>Součástí studia byl Erasmus ve Finsku.</p>
          </div>

          <div className="timeline-item timeline-item--current" data-reveal="true">
            <h3>Ing. Strategický rozvoj podniku (SRP)</h3>
            <p className="timeline-meta">VUT Brno · 2025 – dosud</p>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
