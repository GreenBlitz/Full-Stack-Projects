// בס"ד
import {
  convertFromPixelsToCentimeters,
  distanceFromHub,
} from "@repo/rebuilt_map";
import type { FuelEvents, FuelObject } from "./fuel-object";
import { calculateAverage } from "@repo/array-functions";

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
      fuel.positions.every(
        (position) =>
          distanceFromHub(convertFromPixelsToCentimeters(position)) < distance,
      ),
    ),
  }));

  return Object.assign(
    distancedFuels.map((distancedFuel) => ({
      [distancedFuel.distance]: averageFuel(distancedFuel.fuel),
    })),
  );
};
