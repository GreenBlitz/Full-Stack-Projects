// בס"ד
import type { GameObject } from "./game-object";

export interface GameObjectScoringData<T> {
  gameObject: GameObject<T>;
  pointsScoredWithGameObject: number;
  rpScoredWithGameObject: number;
}
