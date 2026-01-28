// בס"ד
import type { GameObjectWithPoints } from "./game-object";
import type { GameObjectScoringData } from "./scoring-data";

export interface ScoringCalculator<T> {
  gameObjectsScoringData: GameObjectScoringData<T>[];
}

export const addScoring = <T>(
  scoringCalculator: ScoringCalculator<T>,
  gameObjectWithPoints: GameObjectWithPoints<T>,
): void => {
  const tempGameObjectScoringData: GameObjectScoringData<T> = {
    gameObject: gameObjectWithPoints.gameObject,
    pointsScoredWithGameObject: gameObjectWithPoints.calculatePoints(
      gameObjectWithPoints.gameObject,
    ),
    rpScoredWithGameObject: gameObjectWithPoints.calculateRP(
      gameObjectWithPoints.gameObject,
    ),
  };
  scoringCalculator.gameObjectsScoringData.push(tempGameObjectScoringData);
};
