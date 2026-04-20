// בס"ד
import { useState, type FC } from "react";
import type { TabProps } from "../ScoutMatch";
import type { ScoutingForm, ShiftType } from "@repo/scouting_types";
import { MovementForm } from "../../components/MovementForm";
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
  const [isClimbing, setIsClimbing] = useState(false);

  if (isClimbing) {
    return (
      <ClimbSection
        isAuto={false}
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

  const getCurrentShift = () => {
    if (shiftType === "transition") {
      return currentForm.tele.transitionShift;
    }
    if (shiftType === "endgame") {
      return currentForm.tele.endgameShift;
    }
    return currentForm.tele.shifts[tabIndex];
  };

  const makeNewShifts = (
    shift: ScoutingForm["tele"]["transitionShift"],
    shifts: ScoutingForm["tele"]["shifts"],
  ) => {
    if (shiftType === "transition") {
      return { transitionShift: shift };
    }
    if (shiftType === "endgame") {
      return { endgameShift: shift };
    }
    const newShifts: ScoutingForm["tele"]["shifts"] = [...shifts];
    newShifts[tabIndex] = shift;
    return { shifts: newShifts };
  };

  return (
    <div className="flex flex-row h-full w-full gap-3 items-center justify-center">
      <MovementForm
        setMovement={(value) => {
          setForm((prevForm) => ({
            ...prevForm,
            tele: {
              ...prevForm.tele,

              ...makeNewShifts(value, prevForm.tele.shifts),
            },
          }));
        }}
        allianceColor={alliance}
        currentMovement={getCurrentShift()}
      />

      {shiftType === "endgame" && (
        <button
          className={`bg-amber-600 h-16 w-16 text-[10px] sm:text-xs `}
          onClick={() => {
            setIsClimbing(true);
          }}
        >
          Climb
        </button>
      )}
    </div>
  );
};
