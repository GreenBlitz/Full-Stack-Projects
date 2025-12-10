// בס"ד
import express from "express";
import { apiRouter } from "./routes";
import { GameObject, GameObjectWithPoints, addGameEvent } from "./game-object";
import { CoralEvent, AlgaeEvent, GameEventsCounter, AllPossibleGameEvents } from "./game-events";
import { addScoring, ScoringCalculator } from "./scoring-calculator";
import { calculatePointsCoral, calculateRPCoral } from "./game-object-coral";
import { calculatePointsAlgae, calculateRPAlgae } from "./game-object-algae";

const app = express();

const defaultPort = 4590;
const port = process.env.BACKEND_PORT ?? defaultPort;

app.use("/api/v1", apiRouter);

app.listen(port, () => {
  console.log(`Production server running at http://localhost:${port}`);
});

const coralCounter: GameEventsCounter<CoralEvent> = {
  L1: 0,
  L2: 0,
  L3: 0,
  L4: 0
}

const algaeCounter: GameEventsCounter<AlgaeEvent> = {
  Processor: 0,
  Net: 0
}

const coral: GameObject<CoralEvent> = {
  name: "coral",
  gameEvents: coralCounter
}

const algae: GameObject<AlgaeEvent> = {
  name: "algae",
  gameEvents: algaeCounter
}

const scoringCalculator: ScoringCalculator<AllPossibleGameEvents> = {
  gameObjectsScoringData: []
}

addGameEvent(coral, "L1")
addGameEvent(coral, "L2")
addGameEvent(algae, "Net")

const coralWithPoints: GameObjectWithPoints<CoralEvent> = {
    gameObject: coral,
    calculatePoints: calculatePointsCoral,
    calculateRP: calculateRPCoral
}

const algaeWithPoints: GameObjectWithPoints<AlgaeEvent> = {
    gameObject: algae,
    calculatePoints: calculateRPAlgae,
    calculateRP: calculateRPAlgae
}

addScoring(scoringCalculator,coral,calculatePointsCoral,calculateRPCoral)
addScoring(scoringCalculator,algae,calculatePointsAlgae,calculateRPAlgae)



console.log(scoringCalculator)

