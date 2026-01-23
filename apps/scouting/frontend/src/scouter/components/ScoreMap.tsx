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

interface ScoreMapProps {
  currentPoint?: Point;
  setPosition: Dispatch<SetStateAction<Point | undefined>>;
  alliance: "red" | "blue";
  mapZone: "red" | "blue";
}

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
  return { x: Math.round(boundedX), y: Math.round(boundedY) };
};

export const ScoreMap: FC<ScoreMapProps> = ({
  currentPoint,
  setPosition,
  alliance,
  mapZone,
}) => {
  const [isHolding, setHolding] = useState(false);
  const handleMapClick = (event: TouchEvent<HTMLDivElement>) => {
    if (!isHolding) {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();

    const touch = event.touches[firstTouchIndex];

    setPosition(getRobotPosition(touch, rect));
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

      {currentPoint && (
        <div
          className={`absolute border-2 border-black shadow-[0_0_10px_#ccff00] -translate-x-1/2 -translate-y-1/2 pointer-events-none`}
          style={{
            left: currentPoint.x,
            top: currentPoint.y,
            width: dotDiameter,
            height: dotDiameter,
            backgroundColor: alliance === "blue" ? "darkcyan" : "crimson",
          }}
        />
      )}
    </div>
  );
};
