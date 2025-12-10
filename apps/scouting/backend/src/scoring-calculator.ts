import { GameObject, GameObjectWithPoints } from "./game-object";
import { AllPossibleGameEvents } from "./game-events";
import { GameObjectScoringData } from "./scoring-data";

export interface ScoringCalculator<T extends AllPossibleGameEvents>{
    gameObjectsScoringData: GameObjectScoringData<T>[]
}


export function addScoring<T extends AllPossibleGameEvents>(scoringCalculator: ScoringCalculator<T>,
    gameObjectWithPoints: GameObjectWithPoints<T>){
        const tempGameObjectScoringData: GameObjectScoringData<T> = {
            gameObject: gameObjectWithPoints.gameObject,
            pointsScoredWithGameObject: gameObjectWithPoints.calculatePoints(gameObjectWithPoints.gameObject),
            rpScoredWithGameObject: gameObjectWithPoints.calculateRP(gameObjectWithPoints.gameObject)
        }
        scoringCalculator.gameObjectsScoringData.push(tempGameObjectScoringData)
}