// בס"ד
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./KillMePLS";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
