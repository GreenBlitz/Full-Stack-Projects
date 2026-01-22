// בס"ד
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import Stopwatch from "./components/Stopwatch";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
  </StrictMode>,
);
