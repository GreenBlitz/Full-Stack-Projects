// בס"ד
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { PieGraph } from "./strategy/generic-pie-chart";
import {
  greenBlitzQuals,
  lineChartProps,
} from "./strategy/datasets.ts/test-dataset";
import { LineGraph } from "./strategy/generic-line-chart";
import App from "./App";

registerSW({ immediate: true });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
