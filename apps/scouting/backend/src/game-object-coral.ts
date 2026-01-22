// בס"ד
import type { GameObject } from "./game-object";
import type { CoralEvent } from "./game-events";

const L1_SCORING = 2;
const L2_SCORING = 3;
const L3_SCORING = 4;
const L4_SCORING = 5;
export function calculatePointsCoral(coral: GameObject<CoralEvent>): number {
  return (
    coral.gameEvents.L1 * L1_SCORING +
    coral.gameEvents.L2 * L2_SCORING +
    coral.gameEvents.L3 * L3_SCORING +
    coral.gameEvents.L4 * L4_SCORING
  );
}
export function calculateRPCoral(coral: GameObject<CoralEvent>): number {
  const noRP = 0;
  return noRP;
}
