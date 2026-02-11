// בס"ד
import type {
  FuelObject,
  Match,
  Point,
  ShootEvent,
} from "@repo/scouting_types";
import { calculateFuelByAveraging } from "./calculations/fuel-averaging";
import { calculateFuelByMatch } from "./calculations/fuel-match";
import { ALLIANCE_ZONE_WIDTH_PIXELS } from "@repo/rebuilt_map";

export interface BPS {
  events: { shoot: number[]; score: number[] }[];
  match: Match;
}

const isShotPass = (positionPixels: Point) =>
  positionPixels.x > ALLIANCE_ZONE_WIDTH_PIXELS;

const emptyFuelObject: FuelObject = {
  shot: 0,
  pass: 0,
  scored: 0,
  missed: 0,
  positions: [],
};

const putDefaultsInFuel = (fuel: Partial<FuelObject>) => ({
  ...emptyFuelObject,
  ...fuel,
});

export const createFuelObject = (
  shot: ShootEvent,
  match: Match,
  bpses: BPS[],
): FuelObject => {
  const sameMatch = bpses.find(
    (value) =>
      value.match.number === match.number && value.match.type === match.type,
  );

  const isPass = isShotPass(shot.startPosition);

  const partialFuel = sameMatch
    ? calculateFuelByMatch(shot, isPass, sameMatch)
    : calculateFuelByAveraging(
        shot,
        isPass,
        bpses.flatMap((bps) => bps.events),
      );
  return putDefaultsInFuel(partialFuel);
};
