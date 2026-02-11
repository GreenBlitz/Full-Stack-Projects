// בס"ד

import { firstElement } from "@repo/array-functions";
import type { Point } from "@repo/scouting_types";

const QUADRATIC_EXPONENT = 2;
const interpolateTwoPointQuadratic = (x: number, p1: Point, p2: Point) => {
  // Assumes p1 is the "peak" (e.g., distance 0)
  const a = (p2.y - p1.y) / p2.x ** QUADRATIC_EXPONENT;
  return a * x ** QUADRATIC_EXPONENT + p1.y;
};

const ONE_ITEM = 1;
export const interpolateQuadratic = (x: number, points: Point[]): number => {
  const [first, second] = points;

  // array destructuring can make the second undefined, but ESLint doesnt know that
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (first.x >= x || second === undefined) {
    return first.y;
  }
  if (x < second.x) {
    return interpolateQuadratic(x, points.slice(ONE_ITEM));
  }

  return interpolateTwoPointQuadratic(x, first, second);
};
