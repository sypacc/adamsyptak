import { Fragment } from "react";

// Section title whose words rise out of a mask when it scrolls into view,
// echoing the hero name. Driven by the shared [data-reveal] observer plus
// CSS (see .split-heading); text stays one readable string for screen readers.
export default function SplitHeading({ id, text }) {
  const words = text.split(" ");

  return (
    <h2 id={id} className="split-heading" data-reveal="true">
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="split-word">
            <span style={{ "--i": i }}>{w}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </h2>
  );
}
