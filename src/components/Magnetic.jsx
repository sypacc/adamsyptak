import { useRef, useState } from "react";

const MAX_PULL = 10;
const clamp = (v) => Math.max(-MAX_PULL, Math.min(MAX_PULL, v));

function canUsePointerEffects() {
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// Pulls its child a little toward the cursor while hovered and eases back on
// leave (CSS transition on .magnetic). The transform lives on this wrapper so
// the child's own hover transforms (e.g. .contact-link lift) keep working.
export default function Magnetic({ children, strength = 0.2 }) {
  const ref = useRef(null);
  const [enabled] = useState(canUsePointerEffects);

  function handleMove(e) {
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const x = clamp((e.clientX - (rect.left + rect.width / 2)) * strength);
    const y = clamp((e.clientY - (rect.top + rect.height / 2)) * strength);
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
  }

  function handleLeave() {
    ref.current.style.transform = "";
  }

  return (
    <span
      ref={ref}
      className="magnetic"
      onPointerMove={enabled ? handleMove : undefined}
      onPointerLeave={enabled ? handleLeave : undefined}
    >
      {children}
    </span>
  );
}
