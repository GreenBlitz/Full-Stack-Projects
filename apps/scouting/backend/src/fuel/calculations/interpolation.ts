// בס"ד

import { isEmpty } from "@repo/array-functions";
import type { Point } from "@repo/scouting_types";

const QUADRATIC_EXPONENT = 2;
const interpolateTwoPointQuadratic = (x: number, p1: Point, p2: Point) => {
  // Assumes p1 is the "peak" (e.g., distance 0)
  const a = (p2.y - p1.y) / p2.x ** QUADRATIC_EXPONENT;
  return a * x ** QUADRATIC_EXPONENT + p1.y;
};

const ONE_ITEM = 1;
const DEFAULT_EMPTY_VALUE = 0;
const LENGTH_THAT_DOESNT_INCLUDE_TWO_ITEMS = 1;
export const interpolateQuadratic = (
  x: number,
  points: Point[],
  emptyValue = DEFAULT_EMPTY_VALUE,
): number => {
  if (isEmpty(points)) {
    return emptyValue;
  }

  const [first, second] = points;

  if (first.x >= x || points.length === LENGTH_THAT_DOESNT_INCLUDE_TWO_ITEMS) {
    return first.y;
  }
  if (x < second.x) {
    return interpolateQuadratic(x, points.slice(ONE_ITEM));
  }

  return interpolateTwoPointQuadratic(x, first, second);
};
