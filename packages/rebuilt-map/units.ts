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

export const distanceFromHub = (point: Point): number => {
  const difference = {
    x: point.x - CENTER_HUB_POINT_CENTIMETERS.x,
    y: point.y - CENTER_HUB_POINT_CENTIMETERS.y,
  };
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  return Math.sqrt(Math.pow(difference.x, 2) + Math.pow(difference.y, 2));
};
