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
// and drop its cache-busting ?_r= from the address (see the inline script
// in the page's index.html).
try {
  sessionStorage.removeItem("asset-reload");
} catch {
  // storage unavailable (private mode); nothing to clear
}
if (new URLSearchParams(location.search).has("_r")) {
  const url = new URL(location.href);
  url.searchParams.delete("_r");
  history.replaceState(history.state, "", url.pathname + url.search + url.hash);
}
