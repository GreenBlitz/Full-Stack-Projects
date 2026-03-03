// בס"ד
import { convertPixelToCentimeters, distanceFromHub } from "@repo/rebuilt_map";
import { calculateAverage, isEmpty } from "@repo/array-functions";
import type { FuelObject, FuelEvents } from "@repo/scouting_types";

export const averageFuel = (fuels: FuelObject[]): FuelObject => {
  if (isEmpty(fuels)) {
    return { scored: 0, shot: 0, missed: 0, passed: 0, positions: [] };
  }
  const averageOfKey = (key: FuelEvents) =>
    calculateAverage(fuels, (value) => value[key]);

  return {
    scored: averageOfKey("scored"),
    shot: averageOfKey("shot"),
    missed: averageOfKey("missed"),
    passed: averageOfKey("passed"),
    positions: fuels.flatMap((fuel) => fuel.positions),
  };
};

const NO_DISTANCE = 0;
const LAST_ELEMENT_OFFSET = 1;
const PASSED_FUELS_IN_SCORING = 0;

export const splitByDistances = <T extends number>(
  fuels: FuelObject[],
  distances: readonly T[],
): Record<T, FuelObject & { amount: number }> =>
  Object.assign(
    {},
    ...distances.map((distance, index, arr) => {
      const distancedFuels = fuels.filter(
        (fuel) =>
          fuel.passed === PASSED_FUELS_IN_SCORING &&
          fuel.positions.every((position) => {
            const distanceShot = distanceFromHub(
              convertPixelToCentimeters(position),
            );
            const prevDistance =
              arr[index - LAST_ELEMENT_OFFSET] ?? NO_DISTANCE;
            return distanceShot < distance && distanceShot > prevDistance;
          }),
      );
      return {
        [distance]: {
          ...averageFuel(distancedFuels),
          amount: distancedFuels.length,
        },
      };
    }),
  );
