import { useRef } from "react";
import Background from "./components/Background.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Built from "./components/Built.jsx";
import Thinking from "./components/Thinking.jsx";
import Education from "./components/Education.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import { useSiteEffects } from "./hooks/useSiteEffects.js";

export default function App() {
  const headerRef = useRef(null);
  const navRef = useRef(null);
  const navIndicatorRef = useRef(null);
  const contoursElRef = useRef(null);
  const contoursSvgRef = useRef(null);
  const glowElRef = useRef(null);

  useSiteEffects({ headerRef, navRef, navIndicatorRef, contoursElRef, contoursSvgRef, glowElRef });

  return (
    <>
      <Background contoursElRef={contoursElRef} contoursSvgRef={contoursSvgRef} glowElRef={glowElRef} />

      <a className="skip-link" href="#obsah">Přeskočit na obsah</a>

      <Header headerRef={headerRef} navRef={navRef} navIndicatorRef={navIndicatorRef} />

      <main id="obsah">
        <Hero />
        <About />
        <Built />
        <Thinking />
        <Education />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
