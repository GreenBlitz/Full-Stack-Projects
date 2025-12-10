import { GameObject } from "./game-object";
import { AllPossibleGameEvents } from "./src/game-events";
import { GameObjectScoringData } from "./src/scoring-data";

export interface ScoringCalculator<T extends AllPossibleGameEvents>{
    gameObjectsScoringData: GameObjectScoringData<T>[]
}

export function addScoring<T extends AllPossibleGameEvents>(scoringCalculator: ScoringCalculator<T>,
    gameObject: GameObject<T>, calculatePoints: (gameObject: GameObject<T>)=> number,
        calculateRP: (gameObject: GameObject<T>)=> number){
        const tempGameObjectScoringData: GameObjectScoringData<T> = {
            gameObject: gameObject,
            pointsScoredWithGameObject: calculatePointsOfAGameObject(gameObject, calculatePoints),
            rpScoredWithGameObject: calculateRPOfAGameObject(gameObject, calculateRP)
        }
        scoringCalculator.gameObjectsScoringData.push(tempGameObjectScoringData)
}

export function calculatePointsOfAGameObject<T extends AllPossibleGameEvents>(gameObject: GameObject<T>, calculatePoints: (gameObject: GameObject<T>)=> number): number{
        return calculatePoints(gameObject)
}

export function calculateRPOfAGameObject<T extends AllPossibleGameEvents>(gameObject: GameObject<T>, calculateRP: (gameObject: GameObject<T>)=> number): number{
        return calculateRP(gameObject)
}