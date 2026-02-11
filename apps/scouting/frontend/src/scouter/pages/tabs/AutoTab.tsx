// בס"ד
import { useState, type FC } from "react";
import { ScoreMap } from "../../components/ScoreMap";
import type { Alliance, Point } from "@repo/scouting_types";
import Stopwatch from "../../components/stopwatch";
import { MovementForm } from "../../components/MovementForm";
import type { TabProps } from "../ScoutMatch";
import { defaultPoint } from "../../components/ScoreMap";
import { usePositionRecording } from "../../hooks/usePositionRecording";

const EMPTY_ARRAY_LENGTH = 0;

export const AutoTab: FC<TabProps> = ({
  setForm,
  alliance,
  originTime,
  currentForm,
}) => {
  const [mapPosition, setMapPosition] = useState<Point>();
  const [mapZone, setMapZone] = useState<Alliance>(alliance);
  const { recordedPositionsRef, start, stop } = usePositionRecording(mapPosition);

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
              const prevEvents = prevForm.auto.shootEvents;
              const positions =
                recordedPositionsRef.current.length > EMPTY_ARRAY_LENGTH
                  ? [...recordedPositionsRef.current]
                  : [mapPosition ?? { ...defaultPoint }];

              prevEvents.push({
                interval: cycle,
                positions,
              });

              recordedPositionsRef.current = [];
              return prevForm;
            });
          }}
          originTime={originTime}
          disabled={mapPosition === undefined}
          size="compact"
          onStart={start}
          onStop={stop}
        />
        <MovementForm
          setMovement={(value) => {
            setForm((prevForm) => ({
              ...prevForm,
              auto: { ...prevForm.auto, movement: { ...prevForm.auto.movement, ...value } },
            }));
          }}
          currentMovement={currentForm.auto.movement}
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
