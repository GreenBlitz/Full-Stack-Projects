// בס"ד
import { useEffect, useState, type FC } from "react";
import { ScoreMap } from "../../components/ScoreMap";
import type { Alliance, Point } from "@repo/scouting_types";
import Stopwatch from "../../components/stopwatch";
import { MovementForm } from "../../components/MovementForm";
import type { TabProps } from "../ScoutMatch";
import { defaultPoint } from "../../components/ScoreMap";
import { usePositionRecording } from "../../hooks/usePositionRecording";
import { isEmpty } from "@repo/array-functions";

export const AutoTab: FC<TabProps> = ({
  setForm,
  alliance,
  originTime,
  currentForm,
}) => {
  const [mapPosition, setMapPosition] = useState<Point>();
  const { recordedPositionsRef, start, stop } =
    usePositionRecording(mapPosition);
  useEffect(
    () => () => {
      setForm({
        ...currentForm,
        auto: { ...currentForm.auto, path: recordedPositionsRef.current },
      });
    },
    [],
  );
  return (
    <div className="flex flex-row h-full w-full gap-3">
      <div className="flex-1 min-w-0 h-full">
        <ScoreMap
          setPosition={setMapPosition}
          currentPoint={mapPosition}
          alliance={alliance}
          mapZone={alliance}
          onStartTouch={start}
          onStopTouch={stop}
        />
      </div>
    </div>
  );
};
