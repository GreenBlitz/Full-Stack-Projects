import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { Axios } from "axios";
import { Axios1 } from "./axios";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Axios1 />
  </StrictMode>,
);
