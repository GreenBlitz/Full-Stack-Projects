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
    <div className="flex flex-row h-full w-full">
      <ScoreMap
        setPosition={setMapPosition}
        currentPoint={mapPosition}
        alliance={alliance}
        mapZone={mapZone}
      />
      <div className="flex flex-col items-center">
        <Stopwatch
          addCycleTimeSeconds={(cycle) => {
            setForm((prevForm) => {
              const prevEvents = prevForm.tele.shifts[tabIndex].shootEvents;
              prevEvents.push({
                interval: cycle,
                startPosition: mapPosition ?? { x: 0, y: 0 },
              });
              return prevForm;
            });
          }}
          originTime={originTime}
          disabled={mapPosition === undefined}
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
        <div className="bg-red-800" />
        <div className="bg-blue-800" />
        <button
          className={`bg-${mapZone}-800 h-10 w-32 text-xs px-2 mt-10`}
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
