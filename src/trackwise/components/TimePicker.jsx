import { useState } from "react";
import { DAY_START, DAY_END, pad, bookingsForDate, hourStates, pastUntil, rangeConflict } from "../utils/booking.js";

function range(start, hours) {
  return pad(start) + ":00–" + pad(start + hours) + ":00";
}

// Časová osa jednoho dne (DAY_START–DAY_END). Obsazené úseky jsou spojené
// bloky, nad volnou hodinou se ukáže náhled celého tréninku zvolené délky —
// zelený, když se vejde, červený s důvodem, když ne. Vybrat jde jen volný
// začátek; o kolizi rozhoduje vždy rangeConflict().
export default function TimePicker({ dateKey, hours, startHour, onSelect }) {
  const [hover, setHover] = useState(null);

  const states = hourStates(dateKey);
  const bookings = bookingsForDate(dateKey);
  const until = pastUntil(dateKey);
  const hourList = [];
  for (let h = DAY_START; h < DAY_END; h++) hourList.push(h);

  const preview = hover !== null && hover !== startHour ? hover : null;
  const previewConflict = preview !== null ? rangeConflict(dateKey, preview, hours) : null;
  const previewSpan = preview !== null ? Math.min(hours, DAY_END - preview) : 0;

  function place(start, span) {
    return { "--s": start - DAY_START + 1, "--n": span };
  }

  function handleCell(h) {
    if (startHour === h) {
      onSelect(null);
      return;
    }
    if (!rangeConflict(dateKey, h, hours)) onSelect(h);
  }

  return (
    <div className="tp">
      <div className="tp-track" style={{ "--cols": DAY_END - DAY_START }} onMouseLeave={() => setHover(null)}>
        {hourList.map((h) => {
          const st = states[h - DAY_START];
          const isFree = st === "free";
          const conflict = isFree ? rangeConflict(dateKey, h, hours) : null;
          return (
            <button
              type="button"
              key={h}
              className={"tp-cell" + (isFree ? "" : " is-blocked") + (isFree && conflict ? " is-nofit" : "")}
              style={place(h, 1)}
              disabled={!isFree}
              aria-pressed={startHour === h}
              aria-label={
                isFree
                  ? conflict
                    ? "Začátek v " + pad(h) + ":00 — nevejde se: " + conflict.reason
                    : "Začít v " + pad(h) + ":00, trénink " + range(h, hours)
                  : pad(h) + ":00 — obsazeno"
              }
              onMouseEnter={() => setHover(isFree ? h : null)}
              onFocus={() => setHover(isFree ? h : null)}
              onBlur={() => setHover(null)}
              onClick={() => handleCell(h)}
            >
              <span className="tp-hour">{pad(h)}:00</span>
            </button>
          );
        })}

        {until > DAY_START && (
          <div className="tp-block is-past" style={place(DAY_START, until - DAY_START)} aria-hidden="true">
            <span className="tp-block-title">Už proběhlo</span>
          </div>
        )}

        {bookings.map((b) => (
          <div
            key={b.start + "-" + b.hours + (b.isOwn ? "-own" : "")}
            className={"tp-block" + (b.isOwn ? " is-own" : " is-booked")}
            style={place(b.start, b.hours)}
            aria-hidden="true"
          >
            <span className="tp-block-title">{b.isOwn ? "Tvoje rezervace" : "Obsazeno"}</span>
            <span className="tp-block-meta">{range(b.start, b.hours)}{b.isOwn ? "" : " · " + b.name}</span>
          </div>
        ))}

        {startHour !== null && (
          <div className="tp-block is-selected" style={place(startHour, hours)} aria-hidden="true">
            <span className="tp-block-title">Tvůj trénink</span>
            <span className="tp-block-meta">{range(startHour, hours)}</span>
          </div>
        )}

        {preview !== null && (
          <div className={"tp-block is-preview" + (previewConflict ? " is-invalid" : "")} style={place(preview, previewSpan)} aria-hidden="true">
            <span className="tp-block-title">{previewConflict ? "Nevejde se" : "Kliknutím vybereš"}</span>
            <span className="tp-block-meta">{previewConflict ? previewConflict.reason : range(preview, hours)}</span>
          </div>
        )}
      </div>

      <div className="tp-axis" aria-hidden="true">
        <span>{pad(DAY_START)}:00</span>
        <span>{pad(DAY_END)}:00</span>
      </div>

      <ul className="tp-legend" aria-hidden="true">
        <li><i className="tp-swatch is-free"></i>Volno</li>
        <li><i className="tp-swatch is-booked"></i>Obsazeno</li>
        <li><i className="tp-swatch is-own"></i>Tvoje rezervace</li>
        <li><i className="tp-swatch is-selected"></i>Tvůj výběr</li>
      </ul>
    </div>
  );
}
