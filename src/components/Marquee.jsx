const NAMES = [
  "Česká spořitelna",
  "Decathlon",
  "KPMG",
  "Startup VUT",
  "Česká televize",
  "Radio Junior",
  "data.Brno",
  "NSZM ČR",
  "TAFISA",
  "Gratias Tibi",
];

// Endless strip of partners and media mentions. The list is rendered twice
// so the track can slide by exactly half its width and loop seamlessly.
export default function Marquee() {
  return (
    <div className="marquee" role="region" aria-label="Spolupráce a zmínky v médiích">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1 ? "true" : undefined}>
            {NAMES.map((n) => <li key={n}>{n}</li>)}
          </ul>
        ))}
      </div>
    </div>
  );
}
