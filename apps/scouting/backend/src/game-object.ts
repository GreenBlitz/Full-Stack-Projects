import { AllPossibleGameEvents, GameEventsCounter } from "./game-events";

export interface GameObject<T extends AllPossibleGameEvents>{
    name: string;
    gameEvents: GameEventsCounter<T>;
}

export function addGameEvent<T extends AllPossibleGameEvents>(gameObject: GameObject<T> , event: T): void {
    gameObject.gameEvents[event]++
}