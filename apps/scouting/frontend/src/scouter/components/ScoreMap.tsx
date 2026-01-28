// בס"ד

import {
  type Dispatch,
  type FC,
  type SetStateAction,
  useRef,
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

const firstTouchIndex = 0;

const getRobotPosition = (
  touch: Touch,
  imageRect: DOMRect,
  containerRect: DOMRect,
) => {
  const x = touch.clientX - imageRect.left;
  const y = touch.clientY - imageRect.top;

  const boundedX = Math.min(
    imageRect.width - dotRadius,
    Math.max(x, dotRadius),
  );

  const boundedY = Math.min(
    imageRect.height - dotRadius,
    Math.max(y, dotRadius),
  );

  return {
    mapPoint: {
      x: boundedX + imageRect.left - containerRect.left,
      y: boundedY + imageRect.top - containerRect.top,
    },
    normalizedPoint: { x: boundedX, y: boundedY },
    imageSize: { x: imageRect.width, y: imageRect.height },
  };
};

export const ScoreMap: FC<ScoreMapProps> = ({
  currentPoint,
  setPosition,
  alliance,
  mapZone,
}) => {
  const [isHolding, setHolding] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [mapPoint, setMapPoint] = useState(currentPoint);

  const handleMapClick = (event: TouchEvent<HTMLImageElement>) => {
    if (!isHolding) {
      return;
    }
    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) {
      return;
    }
    const containerRect = container.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();
    const touch = event.targetTouches[firstTouchIndex];

    const { mapPoint: dotPoint, normalizedPoint, imageSize } = getRobotPosition(
      touch,
      imageRect,
      containerRect,
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
    <div
      ref={containerRef}
      draggable={false}
      className="h-full w-full relative touch-none flex items-center justify-center"
    >
      <img
        ref={imageRef}
        src={`/${mapZone}-field-4418.png`}
        onTouchMove={handleMapClick}
        onTouchStart={() => {
          setHolding(true);
        }}
        onTouchEnd={() => {
          setHolding(false);
        }}
        className="block max-h-full max-w-full select-none"
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
