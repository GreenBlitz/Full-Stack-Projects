import { AllPossibleGameEvents, GameEventsCounter } from "./src/game-events";

export interface GameObject<T extends AllPossibleGameEvents>{
    name: string;
    gameEvents: GameEventsCounter<T>;
    calculatePoints(): number
    calculateRP(): number
}

export function addGameEvent<T extends AllPossibleGameEvents>(gameObject: GameObject<T> , event: T): void {
    gameObject.gameEvents[event]++
  }