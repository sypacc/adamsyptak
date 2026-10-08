import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import App from "./App.jsx";
import "./styles/global.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// The app started, so the assets loaded: allow a future stale-cache reload
// (see the inline script in the page's index.html).
try {
  sessionStorage.removeItem("asset-reload");
} catch {
  // storage unavailable (private mode); nothing to clear
}
