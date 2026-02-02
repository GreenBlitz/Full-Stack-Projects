// בס"ד
import type { GameObject } from "./game-object";
import type { AlgaeEvent } from "./game-events";


const processorScoring = 6;
const netScoring = 4;

export function calculatePointsAlgae(algae: GameObject<AlgaeEvent>): number {
        return algae.gameEvents.Net*netScoring
        +algae.gameEvents.Processor*processorScoring
    }
export function calculateRPAlgae(algae: GameObject<AlgaeEvent>): number {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        return 0;
}
