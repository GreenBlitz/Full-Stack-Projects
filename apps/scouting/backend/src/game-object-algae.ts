import { GameObject } from "../game-object";
import { AlgaeEvent, AllPossibleGameEvents, CoralEvent } from "./game-events";

export function calculatePointsAlgae(algae: GameObject<AlgaeEvent>): number {
        return algae.gameEvents.Net*NET_SCORING
        +algae.gameEvents.Processor*PROCESSOR_SCORING
    }
export function calculateRPAlgae(): number {
        return 0
}

const PROCESSOR_SCORING: number = 6
const NET_SCORING: number = 4