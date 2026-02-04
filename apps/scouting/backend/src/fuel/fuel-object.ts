// בס"ד
import type { GameObject } from "../game-object";
import type { Match, Point, ShootEvent } from "@repo/scouting_types";
import { calculateFuelByAveraging } from "./calculations/fuel-averaging";
import { calculateFuelByMatch } from "./calculations/fuel-match";

export interface BPS {
  events: { shoot: number[]; score: number[] }[];
  match: Match;
}

export type FuelEvents = "scored" | "shot" | "missed";
export type FuelObject = GameObject<
  FuelEvents,
  {
    positions: Point[];
  }
>;

export const createFuelObject = (
  shot: ShootEvent,
  match: Match,
  bpses: BPS[],
): FuelObject => {
  const sameMatch = bpses.find(
    (value) =>
      value.match.number === match.number && value.match.type === match.type,
  );

  if (sameMatch) {
    return calculateFuelByMatch(shot, sameMatch);
  }

  return calculateFuelByAveraging(
    shot,
    match,
    bpses.flatMap((bps) => bps.events),
  );
};
