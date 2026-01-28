// בס"ד

import { useState, type FC } from "react";
import type { TabProps } from "../ScoutMatch";
import { ScoreMap } from "../../components/ScoreMap";
import type { Alliance, Point } from "@repo/scouting_types";
import Stopwatch from "../../../components/stopwatch";
import { MovementForm } from "../../components/MovementForm";

interface ShiftTabProps extends TabProps {
  tabIndex: number;
}

export const defaultPoint: Point = { x: 0, y: 0 };

export const ShiftTab: FC<ShiftTabProps> = ({
  setForm,
  tabIndex,
  alliance,
  originTime,
  currentForm,
}) => {
  const [mapPosition, setMapPosition] = useState<Point>();
  const [mapZone, setMapZone] = useState<Alliance>(alliance);

  return (
    <div className="flex flex-row h-full w-full gap-3">
      <div className="flex-1 min-w-0 h-full">
        <ScoreMap
          setPosition={setMapPosition}
          currentPoint={mapPosition}
          alliance={alliance}
          mapZone={mapZone}
        />
      </div>
      <div className="flex flex-col items-center gap-0.5 sm:gap-1 shrink-0 w-32 sm:w-36 min-h-0 py-0.5 sm:py-1">
        <Stopwatch
          addCycleTimeSeconds={(cycle) => {
            setForm((prevForm) => {
              const prevEvents = prevForm.tele.shifts[tabIndex].shootEvents;
              prevEvents.push({
                interval: cycle,
                startPosition: mapPosition ?? { ...defaultPoint },
              });
              return prevForm;
            });
          }}
          originTime={originTime}
          disabled={mapPosition === undefined}
          size="compact"
        />
        <MovementForm
          setMovement={(value) => {
            setForm((prevForm) => ({
              ...prevForm,
              tele: { ...prevForm.tele, movement: value },
            }));
          }}
          currentMovement={currentForm.tele.movement}
        />
        <button
          className={`bg-${mapZone}-800 h-8 sm:h-10 w-32 text-[10px] sm:text-xs px-2`}
          onClick={() => {
            setMapZone((prev) => (prev === "red" ? "blue" : "red"));
          }}
        >
          Field Side
        </button>
      </div>
    </div>
  );
};
