// בס"ד
import type { GameObject } from "./game-object";
import type { AllPossibleGameEvents } from "./game-events";

export interface GameObjectScoringData<T extends AllPossibleGameEvents> {
  gameObject: GameObject<T>;
  pointsScoredWithGameObject: number;
  rpScoredWithGameObject: number;
}
