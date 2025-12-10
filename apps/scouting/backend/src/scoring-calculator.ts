import { GameObject } from "./game-object";
import { AllPossibleGameEvents } from "./game-events";
import { GameObjectScoringData } from "./scoring-data";

export interface ScoringCalculator<T extends AllPossibleGameEvents>{
    gameObjectsScoringData: GameObjectScoringData<T>[]
}

export function addGameObjectStatsToCalculator<T extends AllPossibleGameEvents>(gameEvents: GameObjectScoringData<T>){
    addScoring
}

export function addScoring<T extends AllPossibleGameEvents>(scoringCalculator: ScoringCalculator<T>,
    gameObject: GameObject<T>, calculatePoints: (gameObject: GameObject<T>)=> number,
        calculateRP: (gameObject: GameObject<T>)=> number){
        const tempGameObjectScoringData: GameObjectScoringData<T> = {
            gameObject: gameObject,
            pointsScoredWithGameObject: calculatePoints(gameObject),
            rpScoredWithGameObject: calculateRP(gameObject)
        }
        scoringCalculator.gameObjectsScoringData.push(tempGameObjectScoringData)
}