// בס"ד

import {
  type Dispatch,
  type FC,
  type SetStateAction,
  useState,
  type TouchEvent,
  type Touch,
} from "react";
import type { Point } from "@repo/scouting_types";
import { pipe } from "fp-ts/lib/function";

type Alliance = "red" | "blue";

interface ScoreMapProps {
  currentPoint?: Point;
  setPosition: Dispatch<SetStateAction<Point | undefined>>;
  alliance: Alliance;
  mapZone: Alliance;
}

const ALLIANCE_ZONE_WIDTH_PIXELS = 395;
const TWO_THIRDS_WIDTH_PIXELS = 1010;
const HEIGHT_PIXELS = 652;
const alliancizePosition = (
  alliance: Alliance,
  position: Point,
  bounds: Point,
): Point => {
  if (alliance === "red") {
    return position;
  }

  return { x: bounds.x - position.x, y: bounds.y - position.y };
};

const otherZone = (point: Point) => {
  return {
    ...point,
    x: point.x + ALLIANCE_ZONE_WIDTH_PIXELS,
  };
};

const normalizePosition = (point: Point, bounds: Point) => ({
  x: (point.x * TWO_THIRDS_WIDTH_PIXELS) / bounds.x,
  y: (point.y * HEIGHT_PIXELS) / bounds.y,
});

const dotRadius = 10;
const radiusToDiameterRatio = 2;
const dotDiameter = dotRadius * radiusToDiameterRatio;

const firstTouchIndex = 0;

const getRobotPosition = (touch: Touch, bound: DOMRect) => {
  const x = touch.clientX - bound.left;
  const y = touch.clientY - bound.top;

  const boundedX = Math.min(
    bound.right - dotRadius - bound.left,
    Math.max(x, dotRadius),
  );

  const boundedY = Math.min(
    bound.bottom - dotRadius - bound.top,
    Math.max(y, dotRadius),
  );

  return { x: boundedX, y: boundedY };
};

export const ScoreMap: FC<ScoreMapProps> = ({
  currentPoint,
  setPosition,
  alliance,
  mapZone,
}) => {
  const [isHolding, setHolding] = useState(false);

  const [mapPoint, setMapPoint] = useState(currentPoint);

  const handleMapClick = (event: TouchEvent<HTMLDivElement>) => {
    if (!isHolding) {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const touch = event.touches[firstTouchIndex];

    const dotPoint = getRobotPosition(touch, rect);

    setMapPoint(dotPoint);

    setPosition(
      pipe(
        dotPoint,
        (point) =>
          alliancizePosition(alliance, point, {
            x: rect.width,
            y: rect.height,
          }),
        (point) => normalizePosition(point, { x: rect.width, y: rect.height }),
        (point) => (alliance === mapZone ? point : otherZone(point)),
        (point) => ({ x: Math.round(point.x), y: Math.round(point.y) }),
      ),
    );
  };

  return (
    <div draggable={false} className="h-full relative touch-none">
      <img
        src={`/${mapZone}-field-4418.png`}
        onTouchMove={handleMapClick}
        onTouchStart={() => {
          setHolding(true);
        }}
        onTouchEnd={() => {
          setHolding(false);
        }}
        className="h-full block select-none"
        alt="Game Map"
        draggable={false}
      />

      {mapPoint && (
        <div
          className={`absolute border-2 border-black shadow-[0_0_10px_#ccff00] -translate-x-1/2 -translate-y-1/2 pointer-events-none`}
          style={{
            left: mapPoint.x,
            top: mapPoint.y,
            width: dotDiameter,
            height: dotDiameter,
            backgroundColor: alliance === "blue" ? "darkcyan" : "crimson",
          }}
        />
      )}
    </div>
  );
};
