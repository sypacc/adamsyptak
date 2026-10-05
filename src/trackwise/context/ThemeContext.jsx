import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { flushSync } from "react-dom";

const ThemeContext = createContext(null);

function storedTheme() {
  try {
    return localStorage.getItem("tw-theme");
  } catch (e) {
    return null;
  }
}

function persistTheme(theme) {
  try {
    localStorage.setItem("tw-theme", theme);
  } catch (e) {
    // private mode / storage blocked — theme still applies for this load
  }
}

function applyToDocument(theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => (storedTheme() === "light" ? "light" : "dark"));

  useEffect(() => {
    applyToDocument(theme);
  }, [theme]);

  // `origin` is the toggle's centre in viewport px; when the browser
  // supports View Transitions the new theme grows out of it as a circle.
  const toggleTheme = useCallback((origin) => {
    const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    const commit = () => {
      applyToDocument(next);
      flushSync(() => setTheme(next));
      persistTheme(next);
    };

    if (window.navigator && typeof window.navigator.vibrate === "function") {
      window.navigator.vibrate(12);
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduceMotion || !origin) {
      commit();
      return;
    }

    const root = document.documentElement;
    root.classList.add("theme-wipe");
    const transition = document.startViewTransition(commit);
    transition.ready.then(() => {
      const radius = Math.hypot(
        Math.max(origin.x, window.innerWidth - origin.x),
        Math.max(origin.y, window.innerHeight - origin.y)
      );
      root.animate(
        { clipPath: [`circle(0px at ${origin.x}px ${origin.y}px)`, `circle(${radius}px at ${origin.x}px ${origin.y}px)`] },
        { duration: 700, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" }
      );
    });
    transition.finished.finally(() => root.classList.remove("theme-wipe"));
  }, []);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
