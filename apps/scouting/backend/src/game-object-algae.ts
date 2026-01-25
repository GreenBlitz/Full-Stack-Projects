// בס"ד
import type { GameObject } from "./game-object";
import type { AlgaeEvent } from "./game-events";

const PROCESSOR_SCORING = 6;
const NET_SCORING = 4;

export const calculatePointsAlgae = (algae: GameObject<AlgaeEvent>): number => {
  return (
    algae.gameEvents.Net * NET_SCORING +
    algae.gameEvents.Processor * PROCESSOR_SCORING
  );
}
export const calculateRPAlgae = (algae: GameObject<AlgaeEvent>): number => {
  const noRP = 0;
  return noRP;
}
