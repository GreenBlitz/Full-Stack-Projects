//בס"ד

import type { ClimbAllianceData } from "../../forecast";
import type { ClimbLevel, Match, Point } from "../scouting_form";

export interface GeneralFuelData {
  fullGame: FuelObject;
  auto: FuelObject;
  tele: FuelObject;
}

export interface GeneralClimbData {
  fullGame: number;
  auto: number;
  tele: number;
}

export interface GeneralData {
  teamNumber: number;
  fuelData: GeneralFuelData;
  highestClimbLevel: ClimbLevel;
  avarageClimbPoints: GeneralClimbData;
}

export type GameTime = keyof GeneralFuelData;

export interface BPSEvent {
  shoot: number[];
  score: number[];
  positions: Point[];
}

export interface BPS {
  events: BPSEvent[];
  match: Match;
}

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
