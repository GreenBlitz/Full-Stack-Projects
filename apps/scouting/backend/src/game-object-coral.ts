// בס"ד
import type { GameObject } from "./game-object";
import type {
  AlgaeEvent,
  AllPossibleGameEvents,
  CoralEvent,
} from "./game-events";

const L1_SCORING: number = 2;
const L2_SCORING: number = 3;
const L3_SCORING: number = 4;
const L4_SCORING: number = 5;
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
