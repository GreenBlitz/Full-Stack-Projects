// בס"ד

import type { Match } from "@repo/scouting_types";

export interface GameObject<T> {
  match: Match;
  gameEvents: T[];
}

export const addGameEvent = <T>(gameObject: GameObject<T>, event: T): void => {
  gameObject.gameEvents.push(event);
};

export interface GameObjectWithPoints<T> {
  gameObject: GameObject<T>;
  calculatePoints: (gameObject: GameObject<T>) => number;
  calculateRP: (gameObject: GameObject<T>) => number;
}
