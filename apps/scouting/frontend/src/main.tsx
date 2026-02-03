// בס"ד
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { LineGraph } from "./strategy/generic-line-chart";
import { scoringTeams } from "./strategy/datasets.ts/test-dataset";

registerSW({ immediate: true });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LineGraph dataSetsProps={[scoringTeams]}></LineGraph>
    </BrowserRouter>
  </StrictMode>,
);
