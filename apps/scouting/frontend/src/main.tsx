// בס"ד
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import { registerSW } from "virtual:pwa-register";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// registerSW({ immediate: true });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
