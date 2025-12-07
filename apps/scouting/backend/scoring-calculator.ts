import { GameObject } from "./game-object";
import { AllPossibleGameEvents } from "./src/game-events";
import { GameObjectScoringData } from "./src/scoring-data";

export interface ScoringCalculator{
    gameObjectsScoringData: GameObjectScoringData<AllPossibleGameEvents>[]
}

export function AddGameObject(gameObjectsScoringData: GameObjectScoringData<AllPossibleGameEvents>[],
    gameObject: GameObject<AllPossibleGameEvents>, calculatePoints: ()=> number,
        calculateRP: ()=> number){
        const tempGameObjectScoringData: GameObjectScoringData<AllPossibleGameEvents> = {
            gameObject: gameObject,
            pointsScoredWithGameObject: calculatePointsOfAGameObject(gameObject,calculatePoints),
            rpScoredWithGameObject: calculateRPOfAGameObject(gameObject, calculateRP)
        }
        gameObjectsScoringData.push(tempGameObjectScoringData)
}

export function calculatePointsOfAGameObject(gameObject: GameObject<AllPossibleGameEvents>, calculatePoints: ()=> number): number{
        return calculatePoints()
}

export function calculateRPOfAGameObject(gameObject: GameObject<AllPossibleGameEvents>, calculateRP: ()=> number): number{
        return calculateRP()
}