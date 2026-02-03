// בס"ד
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { PieGraph } from "./strategy/generic-pie-chart";
import { scoringQual1 } from "./strategy/datasets.ts/test-dataset";

registerSW({ immediate: true });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <PieGraph
        name={scoringQual1.name}
        points={scoringQual1.points}
        color={scoringQual1.color}
      ></PieGraph>
    </BrowserRouter>
  </StrictMode>,
);
