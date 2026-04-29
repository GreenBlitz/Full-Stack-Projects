//בס"ד

import type { ClimbLevel, Point } from "../scouting_form";

export interface GeneralClimbData {
  fullGame: number;
  auto: number;
  tele: number;
}

export interface GeneralData {
  teamNumber: number;
  highestClimbLevel: ClimbLevel;
  avarageClimbPoints: GeneralClimbData;
}

export type GamePeriod = "auto" | "fullGame" | "tele";

export type GameObject<T extends string, AdditionalInfo> = Record<T, number> &
  AdditionalInfo;

export const addGameEvent = <T extends string>(
  gameObject: GameObject<T, unknown>,
  event: T,
): void => {
  gameObject[event]++;
};

export interface GameObjectWithPoints<T extends string> {
  gameObject: GameObject<T, unknown>;
  calculatePoints: (gameObject: GameObject<T, unknown>) => number;
  calculateRP: (gameObject: GameObject<T, unknown>) => number;
}

export type GeneralFuelData = any;
