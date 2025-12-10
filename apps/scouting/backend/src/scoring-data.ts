import { GameObject } from "./game-object";
import { AlgaeEvent, AllPossibleGameEvents, CoralEvent } from "./game-events";

export interface GameObjectScoringData<T extends AllPossibleGameEvents>{
    gameObject: GameObject<T>
    pointsScoredWithGameObject: number
    rpScoredWithGameObject: number
}