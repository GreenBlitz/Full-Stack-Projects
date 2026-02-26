// בס"ד

import { useState, type FC, type SetStateAction } from "react";
import type { TabProps } from "../ScoutMatch";
import { ScoreMap, defaultPoint } from "../../components/ScoreMap";
import type {
  Alliance,
  Point,
  ScoutingForm,
  ShiftType,
} from "@repo/scouting_types";
import { MovementForm } from "../../components/MovementForm";
import Stopwatch from "../../components/stopwatch";
import { ClimbSection } from "../../components/ClimbSection";

interface ShiftTabProps extends TabProps {
  tabIndex: number;
  shiftType: ShiftType;
}

export const ShiftTab: FC<ShiftTabProps> = ({
  setForm,
  tabIndex,
  shiftType,
  alliance,
  originTime,
  currentForm,
}) => {
  const [mapPosition, setMapPosition] = useState<Point>();
  const [mapZone, setMapZone] = useState<Alliance>(alliance);
  const [isClimbing, setIsClimbing] = useState(false);

  const isAuto = shiftType === "auto";
  const gamePhase = isAuto ? "auto" : "tele";

  if (isClimbing) {
    return (
      <ClimbSection
        isAuto={isAuto}
        setForm={setForm}
        currentForm={currentForm}
        originTime={originTime}
        onBack={() => {
          setIsClimbing(false);
        }}
        name={shiftType}
        alliance={alliance}
      />
    );
  }

  const getEvents = (form: ScoutingForm) => {
    if (shiftType === "auto") {
      return form.auto.shootEvents;
    }
    if (shiftType === "transition") {
      return form.tele.transitionShift.shootEvents;
    }
    if (shiftType === "endgame") {
      return form.tele.endgameShift.shootEvents;
    }
    return form.tele.shifts[tabIndex].shootEvents;
  };

  const handleSetForm = (cycle: { start: number; end: number }) => {
    setForm((prevForm) => {
      const prevEvents = getEvents(prevForm);
      prevEvents.push({
        interval: cycle,
        startPosition: mapPosition ?? { ...defaultPoint },
      });
      return prevForm;
    });
  };

  const scoreMap = (
    <div className="flex-1 min-w-0 h-full">
      <ScoreMap
        setPosition={setMapPosition}
        currentPoint={mapPosition}
        alliance={alliance}
        mapZone={mapZone}
      />
    </div>
  );

  return (
    <div className="flex flex-row h-full w-full gap-3">
      {alliance === "red" && scoreMap}
      <div className="flex flex-col items-center gap-0.5 sm:gap-1 shrink-0 w-32 sm:w-36 min-h-0 py-0.5 sm:py-1">
        <Stopwatch
          addCycleTimeSeconds={(cycle) => {
            handleSetForm(cycle);
          }}
          originTime={originTime}
          disabled={mapPosition === undefined}
          size="compact"
        />
        <MovementForm
          setMovement={(value) => {
            setForm((prevForm) => ({
              ...prevForm,
              [gamePhase]: {
                ...prevForm[gamePhase],
                movement: value,
              },
            }));
          }}
          currentMovement={currentForm[gamePhase].movement}
        />

        {gamePhase === "tele" && (
          <button
            className={`bg-${mapZone}-500 h-8 sm:h-10 w-32 text-[10px] sm:text-xs px-2`}
            onClick={() => {
              setMapZone((prev) => (prev === "red" ? "blue" : "red"));
            }}
          >
            Field Side
          </button>
        )}

        {(shiftType === "auto" || shiftType === "endgame") && (
          <button
            className={`bg-amber-600 h-8 sm:h-10 w-32 text-[10px] sm:text-xs px-2`}
            onClick={() => {
              setIsClimbing(true);
            }}
          >
            Climb
          </button>
        )}
      </div>
      {alliance === "blue" && scoreMap}
    </div>
  );
};
