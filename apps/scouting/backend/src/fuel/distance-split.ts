// בס"ד
import type { Point } from "@repo/scouting_types";
import type { FuelEvents, FuelObject } from "./fuel-object";
import { calculateAverage } from "@repo/array-functions";

const hubPosition = { x: 1, y: 2 };
export const distanceFromHub = (point: Point): number => {
  return Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2));
};

const averageFuel = (fuels: FuelObject[]): FuelObject => {
  const averageOfKey = (key: FuelEvents) =>
    calculateAverage(fuels, (value) => value[key]);
  return {
    scored: averageOfKey("scored"),
    shot: averageOfKey("shot"),
    missed: averageOfKey("missed"),
    positions: fuels.flatMap((fuel) => fuel.positions),
  };
};

export const splitByDistances = <T extends number>(
  fuels: FuelObject[],
  distances: T[],
): Record<T, FuelObject> => {
  const distancedFuels = distances.map((distance) => ({
    distance,
    fuel: fuels.filter((fuel) =>
      fuel.positions.every((position) => distanceFromHub(position) < distance),
    ),
  }));

  return Object.assign(
    distancedFuels.map((distancedFuel) => ({
      [distancedFuel.distance]: averageFuel(distancedFuel.fuel),
    })),
  );
};
