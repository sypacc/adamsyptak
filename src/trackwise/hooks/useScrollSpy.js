import { useEffect, useState } from "react";

// Ports assets/js/nav.js: tracks which section is currently in view so the
// header nav can highlight the matching link.
export function useScrollSpy(sectionIds) {
  const [activeId, setActiveId] = useState(sectionIds[0] || null);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => ({ id, el: document.getElementById(id) }))
      .filter((s) => s.el);

    if (!sections.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const match = sections.find((s) => s.el === entry.target);
          if (match) setActiveId(match.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s.el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return activeId;
}
