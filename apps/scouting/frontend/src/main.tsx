// בס"ד
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { LineGraph, PieGraph } from "./strategy/generic-line-chart";
import {
  lineChartProps,
  scoring4590,
} from "./strategy/datasets.ts/test-dataset";

registerSW({ immediate: true });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <PieGraph
        name={scoring4590.name}
        points={scoring4590.points}
        color={scoring4590.color}
      ></PieGraph>
    </BrowserRouter>
  </StrictMode>,
);
