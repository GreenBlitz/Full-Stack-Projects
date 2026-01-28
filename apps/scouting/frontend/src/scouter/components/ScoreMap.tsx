// בס"ד

import {
  type Dispatch,
  type FC,
  type SetStateAction,
  useState,
  type TouchEvent,
  type Touch,
} from "react";
import type { Alliance, Point } from "@repo/scouting_types";
import { pipe } from "fp-ts/lib/function";

interface ScoreMapProps {
  currentPoint?: Point;
  setPosition: Dispatch<SetStateAction<Point | undefined>>;
  alliance: Alliance;
  mapZone: Alliance;
}

const ALLIANCE_ZONE_WIDTH_PIXELS = 395;
const TWO_THIRDS_WIDTH_PIXELS = 1010;
const HEIGHT_PIXELS = 652;
const HALF_HEIGHT =  2;
const alliancizePosition = (alliance: Alliance, position: Point): Point => {
  if (alliance === "red") {
    return position;
  }

  return {
    x: TWO_THIRDS_WIDTH_PIXELS - position.x,
    y: HEIGHT_PIXELS - position.y,
  };
};

const switchZone = (point: Point) => {
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
const mapAspectRatio = TWO_THIRDS_WIDTH_PIXELS / HEIGHT_PIXELS;

const firstTouchIndex = 0;

const getRobotPosition = (touch: Touch, bound: DOMRect) => {
  const containerRatio = bound.width / bound.height;

  const imageBounds =
    containerRatio > mapAspectRatio
      ? {
          width: bound.height * mapAspectRatio,
          height: bound.height,
          offsetX: (bound.width - bound.height * mapAspectRatio) / HALF_HEIGHT,
          offsetY: 0,
        }
      : {
          width: bound.width,
          height: bound.width / mapAspectRatio,
          offsetX: 0,
          offsetY: (bound.height - bound.width / mapAspectRatio) / HALF_HEIGHT,
        };

  const x = touch.clientX - bound.left - imageBounds.offsetX;
  const y = touch.clientY - bound.top - imageBounds.offsetY;

  const boundedX = Math.min(
    imageBounds.width - dotRadius,
    Math.max(x, dotRadius),
  );

  const boundedY = Math.min(
    imageBounds.height - dotRadius,
    Math.max(y, dotRadius),
  );

  return {
    mapPoint: {
      x: boundedX + imageBounds.offsetX,
      y: boundedY + imageBounds.offsetY,
    },
    normalizedPoint: { x: boundedX, y: boundedY },
    imageSize: { x: imageBounds.width, y: imageBounds.height },
  };
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
    const touch = event.targetTouches[firstTouchIndex];

    const { mapPoint: dotPoint, normalizedPoint, imageSize } = getRobotPosition(
      touch,
      rect,
    );

    setMapPoint(dotPoint);

    pipe(
      normalizedPoint,
      (point) => normalizePosition(point, { x: imageSize.x, y: imageSize.y }),
      (point) => alliancizePosition(alliance, point),
      (point) => (alliance === mapZone ? point : switchZone(point)),
      (point) => ({ x: Math.round(point.x), y: Math.round(point.y) }),
      setPosition,
    );
  };

  return (
    <div draggable={false} className="h-full w-full relative touch-none">
      <img
        src={`/${mapZone}-field-4418.png`}
        onTouchMove={handleMapClick}
        onTouchStart={() => {
          setHolding(true);
        }}
        onTouchEnd={() => {
          setHolding(false);
        }}
        className="h-full w-full object-contain block select-none"
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
