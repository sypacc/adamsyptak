export default function Education() {
  return (
    <section className="section" id="vzdelani" aria-labelledby="vzdelani-heading">
      <div className="wrap section-grid">
        <h2 className="section-title" id="vzdelani-heading">Vzdělání</h2>
        <ol className="section-content entries" data-reveal="true">
          <li className="entry">
            <p className="entry-when">2025 – dosud</p>
            <div className="entry-body">
              <h3 className="entry-title">
                Ing. Strategický rozvoj podniku
                <span className="entry-role">VUT Brno</span>
              </h3>
            </div>
          </li>
          <li className="entry">
            <p className="entry-when">2022 – 2025</p>
            <div className="entry-body">
              <h3 className="entry-title">
                Bc. Entrepreneurial and Small Business Development
                <span className="entry-role">VUT Brno, studováno a obhájeno v angličtině</span>
              </h3>
              <p>Součástí studia byl Erasmus ve Finsku.</p>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}
