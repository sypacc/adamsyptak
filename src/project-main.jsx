import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/inter";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource/barlow-condensed/700-italic.css";
import "@fontsource/barlow-condensed/800-italic.css";
import TrackWiseApp from "./trackwise/TrackWiseApp.jsx";
import "./styles/trackwise.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TrackWiseApp />
  </StrictMode>
);

// The app started, so the assets loaded: allow a future stale-cache reload
// (see the inline script in the page's index.html).
try {
  sessionStorage.removeItem("asset-reload");
} catch {
  // storage unavailable (private mode); nothing to clear
}
