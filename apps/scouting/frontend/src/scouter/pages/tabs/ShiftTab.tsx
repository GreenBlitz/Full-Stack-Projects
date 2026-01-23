// בס"ד

import { useState, type FC } from "react";
import type { TabProps } from "../ScoutMatch";
import { ScoreMap } from "../../components/ScoreMap";
import type { Point } from "@repo/scouting_types";
import Stopwatch from "../../../components/stopwatch";

type Alliance = "red" | "blue";

interface ShiftTabProps extends TabProps {
  tabIndex: number;
}

export const ShiftTab: FC<ShiftTabProps> = ({
  setForm,
  tabIndex,
  alliance,
  originTime,
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
    </div>
  );
};
