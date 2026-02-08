// בס"ד
import { convertPixelToCentimeters, distanceFromHub } from "@repo/rebuilt_map";
import { calculateAverage, isEmpty } from "@repo/array-functions";
import type { FuelObject, FuelEvents } from "@repo/scouting_types";

export const averageFuel = (fuels: FuelObject[]): FuelObject => {
  if (isEmpty(fuels)) {
    return { scored: 0, shot: 0, missed: 0, pass: 0, positions: [] };
  }
  const averageOfKey = (key: FuelEvents) =>
    calculateAverage(fuels, (value) => value[key]);

  return {
    scored: averageOfKey("scored"),
    shot: averageOfKey("shot"),
    missed: averageOfKey("missed"),
    pass: averageOfKey("pass"),
    positions: fuels.flatMap((fuel) => fuel.positions),
  };
};

export const splitByDistances = <T extends number>(
  fuels: FuelObject[],
  distances: readonly T[],
): Record<T, FuelObject> =>
  Object.assign(
    {},
    ...distances.map((distance) => ({
      [distance]: averageFuel(
        fuels.filter((fuel) =>
          fuel.positions.every(
            (position) =>
              distanceFromHub(convertPixelToCentimeters(position)) < distance,
          ),
        ),
      ),
    })),
  );
