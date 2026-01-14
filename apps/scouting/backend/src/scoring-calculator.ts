// בס"ד
import type { GameObjectWithPoints } from "./game-object";
import type { AllPossibleGameEvents } from "./game-events";
import type { GameObjectScoringData } from "./scoring-data";

export interface ScoringCalculator<T extends AllPossibleGameEvents> {
  gameObjectsScoringData: GameObjectScoringData<T>[];
}

export function addScoring<T extends AllPossibleGameEvents>(
  scoringCalculator: ScoringCalculator<T>,
  gameObjectWithPoints: GameObjectWithPoints<T>
): void {
  const tempGameObjectScoringData: GameObjectScoringData<T> = {
    gameObject: gameObjectWithPoints.gameObject,
    pointsScoredWithGameObject: gameObjectWithPoints.calculatePoints(
      gameObjectWithPoints.gameObject
    ),
    rpScoredWithGameObject: gameObjectWithPoints.calculateRP(
      gameObjectWithPoints.gameObject
    ),
  };
  scoringCalculator.gameObjectsScoringData.push(tempGameObjectScoringData);
}
