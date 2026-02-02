// בס"ד
import type { AllPossibleGameEvents, GameEventsCounter } from "./game-events";

export interface GameObject<T extends AllPossibleGameEvents>{
    name: string;
    gameEvents: GameEventsCounter<T>;
}

export function addGameEvent<T extends AllPossibleGameEvents>(gameObject: GameObject<T> , event: T): void {
    gameObject.gameEvents[event]++
}

export interface GameObjectWithPoints<T extends AllPossibleGameEvents>{
    gameObject: GameObject<T>,
    calculatePoints: (gameObject: GameObject<T>) => number,
    calculateRP: (gameObject: GameObject<T>) => number
}