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
import HTTP_STATUS from "http-status-codes";

const app = express();

const defaultPort = 4590;
const port = process.env.BACKEND_PORT ?? defaultPort;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(HTTP_STATUS.OK);
  } else {
    next();
  }
});

app.use(express.json());
app.use("/api/v1", apiRouter);

app.listen(port, () => {
  console.log(`Production server running at http://localhost:${port}`);
});

const coralCounter: GameEventsCounter<CoralEvent> = {
  L1: 0,
  L2: 0,
  L3: 0,
  L4: 0,
};

const algaeCounter: GameEventsCounter<AlgaeEvent> = {
  Processor: 0,
  Net: 0,
};

const coral: GameObject<CoralEvent> = {
  name: "coral",
  gameEvents: coralCounter,
};

const algae: GameObject<AlgaeEvent> = {
  name: "algae",
  gameEvents: algaeCounter,
};

const scoringCalculator: ScoringCalculator<AllPossibleGameEvents> = {
  gameObjectsScoringData: [],
};

addGameEvent(coral, "L1");
addGameEvent(coral, "L2");
addGameEvent(algae, "Net");

const coralWithPoints: GameObjectWithPoints<CoralEvent> = {
  gameObject: coral,
  calculatePoints: calculatePointsCoral,
  calculateRP: calculateRPCoral,
};

const algaeWithPoints: GameObjectWithPoints<AlgaeEvent> = {
  gameObject: algae,
  calculatePoints: calculatePointsAlgae,
  calculateRP: calculateRPAlgae,
};

addScoring(scoringCalculator, coralWithPoints);
addScoring(scoringCalculator, algaeWithPoints);

console.log(scoringCalculator);
