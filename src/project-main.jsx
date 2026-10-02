import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import TrackWiseApp from "./trackwise/TrackWiseApp.jsx";
import "./styles/trackwise.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TrackWiseApp />
  </StrictMode>
);
