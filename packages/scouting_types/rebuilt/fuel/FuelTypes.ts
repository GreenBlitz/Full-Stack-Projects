//בס"ד

import type { Match, Point } from "../scouting_form";

export interface GeneralFuelData {
  fullGame: FuelObject;
  auto: FuelObject;
  tele: FuelObject;
}

export type GameTime = keyof GeneralFuelData;


export interface BPS {
  events: { shoot: number[]; score: number[] ,positions: Point[]}[];
  match: Match;
}

type FuelEvents = "scored" | "shot" | "missed";
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



export type TeamNumberAndFuelData = Record<number, GeneralFuelData>