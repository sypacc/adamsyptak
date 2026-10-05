import { useEffect, useRef, useState } from "react";

const BASE = import.meta.env.BASE_URL;

// Phones get the 720px encode and poster. Chosen here rather than with
// <source media>, which Chromium ignores on <video>. The loop is decoration:
// reduced-motion users and Data Saver connections only get the still.
function pickMedia() {
  const small = window.matchMedia("(max-width: 760px)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  return {
    poster: BASE + (small ? "assets/project/hero-poster-720.webp" : "assets/project/hero-poster-1280.webp"),
    video: reduceMotion || saveData ? null : BASE + (small ? "assets/project/hero-loop-720.mp4" : "assets/project/hero-loop.mp4"),
  };
}

export default function Hero() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [{ poster, video: videoSrc }] = useState(pickMedia);

  // Pause the loop while the hero is scrolled out of view.
  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.05 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="hero" id="uvod" ref={sectionRef}>
      <div className="hero-media" aria-hidden="true">
        {videoSrc ? (
          <video ref={videoRef} className="hero-video" src={videoSrc} autoPlay muted loop playsInline preload="auto" poster={poster} />
        ) : (
          <img className="hero-video" src={poster} alt="" width="1280" height="1080" />
        )}
        <div className="hero-overlay"></div>
      </div>

      <div className="hero-content">
        <div className="hero-text">
          {/* TODO: doplnit finální claim */}
          <h1 className="hero-claim tw-enter" style={{ "--d": "0.1s" }}>
            Trénuj na okruhu jako <span className="accent">profesionál.</span>
          </h1>
          {/* TODO: doplnit finální benefit větu */}
          <p className="hero-benefit tw-enter" style={{ "--d": "0.3s" }}>
            Individuální trénink s instruktorem, který tě posune k rychlejším a jistějším časům.
          </p>

          <div className="hero-actions tw-enter" style={{ "--d": "0.45s" }}>
            {/* TODO: odkaz na rezervační wizard */}
            <a className="btn-primary" href="#rezervace">Rezervovat trénink</a>
            <a className="btn-merch" href="#merch">
              <svg className="btn-merch-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M8.5 3.5 4 5.8 2.5 10l3 1.2.9-1.4V20.5h11.2V9.8l.9 1.4 3-1.2L20 5.8l-4.5-2.3c-.4 1.4-1.8 2.4-3.5 2.4s-3.1-1-3.5-2.4Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
              <span>Merch</span>
              <span className="btn-merch-arrow" aria-hidden="true">→</span>
            </a>
          </div>

          <a className="hero-back tw-enter" style={{ "--d": "0.6s" }} href="../">← Zpět na portfolio</a>
        </div>
      </div>
    </section>
  );
}
