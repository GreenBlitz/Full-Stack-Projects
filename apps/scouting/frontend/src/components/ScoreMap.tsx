// בס"ד

import {
  type Dispatch,
  type FC,
  type SetStateAction,
  type MouseEvent,
  useState,
} from "react";
import type { Point } from "@repo/scouting_types";

interface ScoreMapProps {
  currentPoint?: Point;
  setPosition: Dispatch<SetStateAction<Point | undefined>>;
  mapZone: "red" | "blue";
}

export const ScoreMap: FC<ScoreMapProps> = ({
  currentPoint,
  setPosition,
  mapZone,
}) => {
  const [isHolding, setHolding] = useState(true);
  const handleMapClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!isHolding) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    // Calculate percentage to keep point accurate on resize
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPosition({ x, y });
    console.log(`Selected: X ${x.toFixed(2)}%, Y ${y.toFixed(2)}%`);
  };

  return (
    <div
      draggable={false}
      className="max-h-screen relative mx-auto cursor-grab cursor-crosshair "
      onMouseMove={handleMapClick}
    >
      <img
        src={`/game-map-${mapZone}.png`}
        className="max-h-screen block select-none"
        alt="Game Map"
        draggable={false}
      />

      {/* Selected Marker */}
      {currentPoint && (
        <div
          className="absolute w-5 h-5 bg-lime-400 rounded-full border-2 border-black shadow-[0_0_10px_#ccff00] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: `${currentPoint.x}%`, top: `${currentPoint.y}%` }}
        />
      )}
    </div>
  );
};
