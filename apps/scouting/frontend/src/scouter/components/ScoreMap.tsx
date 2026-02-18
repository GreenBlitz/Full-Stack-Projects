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
import {
  ALLIANCE_ZONE_WIDTH_PIXELS,
  FIELD_HEIGHT_PIXELS,
  TWO_THIRDS_FIELD_WIDTH_PIXELS,
  blueField,
  redField,
} from "@repo/rebuilt_map";
import { pipe } from "fp-ts/lib/function";

interface ScoreMapProps {
  currentPoint?: Point;
  setPosition: Dispatch<SetStateAction<Point | undefined>>;
  alliance: Alliance;
  mapZone: Alliance;
}

const alliancizePosition = (alliance: Alliance, position: Point): Point => {
  if (alliance === "red") {
    return position;
  }

  return {
    x: TWO_THIRDS_FIELD_WIDTH_PIXELS - position.x,
    y: FIELD_HEIGHT_PIXELS - position.y,
  };
};

const switchZone = (point: Point) => {
  return {
    ...point,
    x: point.x + ALLIANCE_ZONE_WIDTH_PIXELS,
  };
};

const normalizePosition = (point: Point, bounds: Point) => ({
  x: (point.x * TWO_THIRDS_FIELD_WIDTH_PIXELS) / bounds.x,
  y: (point.y * FIELD_HEIGHT_PIXELS) / bounds.y,
});

const dotRadius = 10;
const radiusToDiameterRatio = 2;
const dotDiameter = dotRadius * radiusToDiameterRatio;

const firstTouchIndex = 0;
export const defaultPoint: Point = { x: 0, y: 0 };

interface RobotPositionInfo {
  mapPoint: Point;
  normalizedPoint: Point;
  imageSize: Point;
}
const getRobotPosition = (
  touch: Touch,
  imageRect: DOMRect,
  containerRect: DOMRect,
): RobotPositionInfo => {
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
      // finds a value for x that is in the bounded y
      x: boundedX + imageRect.left - containerRect.left,
      // finds a value for x that is in the bounded y
      y: boundedY + imageRect.top - containerRect.top,
    },
    normalizedPoint: {
      x: boundedX,
      y: boundedY,
    },
    imageSize: {
      x: imageRect.width,
      y: imageRect.height,
    },
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
    const containerElement = containerRef.current;
    const imageElement = imageRef.current;
    if (!(containerElement && imageElement)) {
      return;
    }
    const containerRect = containerElement.getBoundingClientRect();
    const imageRect = imageElement.getBoundingClientRect();
    const touch = event.targetTouches[firstTouchIndex];

    const {
      mapPoint: dotPoint,
      normalizedPoint,
      imageSize,
    } = getRobotPosition(touch, imageRect, containerRect);

    setMapPoint(dotPoint);

    pipe(
      normalizedPoint,
      (point) => normalizePosition(point, imageSize),
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
        src={mapZone === "red" ? redField : blueField}
        onTouchMove={(event) => {
          if (isHolding) {
            handleMapClick(event);
          }
        }}
        onTouchStart={(event) => {
          setHolding(true);
          handleMapClick(event);
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
