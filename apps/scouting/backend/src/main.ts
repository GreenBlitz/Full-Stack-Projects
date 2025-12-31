// בס"ד
import express from "express";
import { apiRouter } from "./routes";
import {
  type GameObject,
  type GameObjectWithPoints,
  addGameEvent,
} from "./game-object";
import type {
  CoralEvent,
  AlgaeEvent,
  GameEventsCounter,
  AllPossibleGameEvents,
} from "./game-events";
import { addScoring, type ScoringCalculator } from "./scoring-calculator";
import { calculatePointsCoral, calculateRPCoral } from "./game-object-coral";
import { calculatePointsAlgae, calculateRPAlgae } from "./game-object-algae";

const app = express();

const defaultPort = 4590;
const port = process.env.BACKEND_PORT ?? defaultPort;

app.use(express.json());
app.use("/api/v1", apiRouter);

app.listen(port, () => {
  console.log(`Production server running at http://localhost:${port}`);
});