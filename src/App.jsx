import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Built from "./components/Built.jsx";
import Thinking from "./components/Thinking.jsx";
import Motto from "./components/Motto.jsx";
import Education from "./components/Education.jsx";
import Contact from "./components/Contact.jsx";
import { usePageEffects } from "./hooks/usePageEffects.js";

export default function App() {
  usePageEffects();

  return (
    <>
      <a className="skip-link" href="#obsah">Přeskočit na obsah</a>
      <Header />
      <main id="obsah">
        <Hero />
        <About />
        <Built />
        <Thinking />
        <Motto />
        <Education />
        <Contact />
      </main>
    </>
  );
}
