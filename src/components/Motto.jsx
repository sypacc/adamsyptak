const STARS = [
  { x: "12%", y: "22%", d: "0s" },
  { x: "84%", y: "18%", d: "0.8s" },
  { x: "22%", y: "78%", d: "1.6s", sm: true },
  { x: "70%", y: "82%", d: "0.4s", sm: true },
  { x: "92%", y: "56%", d: "1.2s", sm: true },
  { x: "5%", y: "52%", d: "2s", sm: true },
];

export default function Motto() {
  return (
    <figure className="motto">
      {STARS.map((s, i) => (
        <span
          key={i}
          className={"motto-star" + (s.sm ? " motto-star--sm" : "")}
          style={{ "--x": s.x, "--y": s.y, "--d": s.d }}
          aria-hidden="true"
        >
          ✦
        </span>
      ))}
      <div className="wrap">
        <blockquote data-reveal="true">
          <p>Hvězdy jsou blíž, <span className="accent">než si myslíte.</span></p>
        </blockquote>
        <figcaption data-reveal="true">— moje motto</figcaption>
      </div>
    </figure>
  );
}
