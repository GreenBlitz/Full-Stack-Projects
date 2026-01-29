// בס"ד
import type { GameObject } from "../game-object";
import type { Match, Point, ShootEvent } from "@repo/scouting_types";
import { calculateFuelByAveraging } from "./fuel-averaging";
import { calculateFuelByMatch } from "./fuel-match";

export type BPS = GameObject<{ shoot: number[]; score: number[] }>;

export interface FuelObject {
  scored: number;
  shot: number;
  missed: number;
  position: Point;
  match: Match;
}

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
    return calculateFuelByMatch(shot, sameMatch, match);
  }

  return calculateFuelByAveraging(
    shot,
    match,
    bpses.flatMap((bps) => bps.gameEvents),
  );
};
