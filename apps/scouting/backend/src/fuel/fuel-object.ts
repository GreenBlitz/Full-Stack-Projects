// בס"ד
import type { BPS, FuelObject, Match, Point, ShootEvent } from "@repo/scouting_types";
import { calculateFuelByAveraging } from "./fuel-averaging";
import { calculateFuelByMatch } from "./fuel-match";


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
