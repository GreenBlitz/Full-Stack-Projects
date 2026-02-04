// בס"ד
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { PieGraph } from "./strategy/generic-pie-chart";
import { greenBlitzQuals } from "./strategy/datasets.ts/test-dataset";

registerSW({ immediate: true });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <PieGraph
        name={greenBlitzQuals.name}
        points={greenBlitzQuals.points}
        color={greenBlitzQuals.color}
      ></PieGraph>
    </BrowserRouter>
  </StrictMode>,
);
