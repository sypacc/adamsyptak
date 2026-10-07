import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/inter";
import SluzbaApp from "./sluzba/SluzbaApp.jsx";
import "./styles/sluzba.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SluzbaApp />
  </StrictMode>
);
