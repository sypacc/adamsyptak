import { createContext, useContext, useEffect, useState, useCallback } from "react";

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

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => (storedTheme() === "light" ? "light" : "dark"));

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.style.colorScheme = theme;
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === "light" ? "dark" : "light";
      persistTheme(next);
      return next;
    });
    if (window.navigator && typeof window.navigator.vibrate === "function") {
      window.navigator.vibrate(12);
    }
  }, []);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
