import { GameObject } from "../game-object";
import { AlgaeEvent, AllPossibleGameEvents, CoralEvent } from "./game-events";

export function calculatePoints(algae: GameObject<AlgaeEvent>): number {
        return algae.gameEvents.Net*NET_SCORING
        +algae.gameEvents.Processor*PROCESSOR_SCORING
    }
export function calculateRP(): number {
        return 0
}

const PROCESSOR_SCORING: number = 6
const NET_SCORING: number = 4