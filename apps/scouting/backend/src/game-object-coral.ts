// בס"ד
import type { GameObject } from "./game-object";
import type { CoralEvent } from "./game-events";

const level1Scoring = 2;
const level2Scoring = 3;
const level3Scoring = 4;
const level4Scoring = 5;

export function calculatePointsCoral(coral: GameObject<CoralEvent>): number {
  return (
    coral.gameEvents.L1 * level1Scoring +
    coral.gameEvents.L2 * level2Scoring +
    coral.gameEvents.L3 * level3Scoring +
    coral.gameEvents.L4 * level4Scoring
  );
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function calculateRPCoral(coral: GameObject<CoralEvent>): number {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  return 0;
}
