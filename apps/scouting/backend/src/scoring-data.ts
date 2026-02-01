// בס"ד
import type { GameObject } from "./game-object";

export interface GameObjectScoringData<T extends string> {
  gameObject: GameObject<T, unknown>;
  pointsScoredWithGameObject: number;
  rpScoredWithGameObject: number;
}
