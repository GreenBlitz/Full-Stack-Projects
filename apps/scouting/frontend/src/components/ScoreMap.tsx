// בס"ד

import {
  type Dispatch,
  type FC,
  type SetStateAction,
  useState,
  type TouchEvent,
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

export const ScoreMap: FC<ScoreMapProps> = ({
  currentPoint,
  setPosition,
  alliance,
  mapZone,
}) => {
  const [isHolding, setHolding] = useState(false);
  const handleMapClick = (e: TouchEvent<HTMLDivElement>) => {
    if (!isHolding) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();

    const touch = e.touches[firstTouchIndex];

    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    if (rect.right - dotRadius < touch.clientX || x < dotRadius) {
      return;
    }
    if (rect.bottom - dotRadius < touch.clientY || y < dotRadius) {
      return;
    }
    setPosition({ x, y });
  };

  return (
    <div
      draggable={false}
      className="max-h-screen relative mx-auto touch-none"
      onTouchMove={handleMapClick}
      onTouchStart={() => {
        setHolding(true);
      }}
      onTouchEnd={() => {
        setHolding(false);
      }}
    >
      <img
        src={`/game-map-${mapZone}.png`}
        className="max-h-screen block select-none"
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
