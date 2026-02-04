// בס"ד
import type { Point } from "@repo/scouting_types";

export const ALLIANCE_ZONE_WIDTH_PIXELS = 395;
export const TWO_THIRDS_FIELD_WIDTH_PIXELS = 1010;
export const FIELD_HEIGHT_PIXELS = 652;

const FIELD_SIZE_CENTIMETERS = { x: 1654, y: 807 };
const CENTER_HUB_POINT_CENTIMETERS = {
  x: 462.534,
  y: 403.5,
};

export const convertFromPixelsToCentimeters = (point: Point): Point => ({
  x: (point.x / TWO_THIRDS_FIELD_WIDTH_PIXELS) * FIELD_SIZE_CENTIMETERS.x,
  y: (point.y / FIELD_HEIGHT_PIXELS) * FIELD_SIZE_CENTIMETERS.y,
});

const distanceFromDifference = (difference: Point): number =>
  Math.sqrt(difference.x * difference.x + difference.y * difference.y);

const distance = (p1: Point, p2: Point): number =>
  distanceFromDifference({ x: p1.x - p2.x, y: p1.y - p2.y });

export const distanceFromHub = (point: Point): number =>
  distance(point, CENTER_HUB_POINT_CENTIMETERS);
