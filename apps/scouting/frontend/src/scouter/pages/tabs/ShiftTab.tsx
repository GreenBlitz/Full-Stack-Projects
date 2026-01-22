// בס"ד

import { useState, type FC } from "react";
import type { TabProps } from "../ScoutMatch";
import { ScoreMap } from "../../components/ScoreMap";
import type { Point } from "@repo/scouting_types";

type Alliance = "red" | "blue";

interface ShiftTabProps extends TabProps {
  tabIndex: number;
}

export const ShiftTab: FC<ShiftTabProps> = ({
  setForm,
  tabIndex,
  alliance,
}) => {
  const [mapPosition, setMapPosition] = useState<Point>();
  const [mapZone, setMapZone] = useState<Alliance>(alliance);
  return (
    <>
      <ScoreMap
        setPosition={setMapPosition}
        currentPoint={mapPosition}
        alliance={alliance}
        mapZone={mapZone}
      />
    </>
  );
};
