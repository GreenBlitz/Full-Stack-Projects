//בס"ד

import type { Match, Point, ShootEvent } from "../scouting_form";

export interface GeneralFuelData {
  fullGame: FuelObject;
  auto: FuelObject;
  tele: FuelObject;
}

export type GameTime = keyof GeneralFuelData;

export type FuelEvents = "scored" | "shot" | "missed" | "passed";
export type FuelObject = GameObject<
  FuelEvents,
  {
    positions: Point[];
  }
>;

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

export type TeamNumberAndFuelData = Record<number, GeneralFuelData>;
