//בס"ד
import type React from "react";
import { useState } from "react";
import { ClimbLevelSlider } from "./ClimbLevelSlider";
import type {
  AutoClimb,
  AutoClimbTime,
  Climb,
  TeleClimbLevel,
  TeleClimbSide,
  TeleClimbTime,
  ScoutingForm,
  Alliance,
} from "@repo/scouting_types";
import { ClimbSideButton } from "./ClimbSideButton";

interface InputClimbProps {
  isAuto: boolean;
  updateClimbForm: (updates: Climb) => void;
  originTime: number;
  currentForm: ScoutingForm;
  alliance: Alliance;
}

export const ClimbInput: React.FC<InputClimbProps> = ({
  isAuto,
  updateClimbForm,
  originTime,
  currentForm,
  alliance,
}) => {
  const [climbLevel, setClimbLevel] = useState<TeleClimbLevel>("L0");
  const [climbSide, setClimbSide] = useState<TeleClimbSide>({
    middle: false,
    side: false,
    support: false,
  });
  const [climbTimes, setClimbTimes] = useState<AutoClimbTime | TeleClimbTime>(
    isAuto
      ? {
          L1: null,
        }
      : {
          L1: null,
          L2: null,
          L3: null,
        },
  );
  const handleSideUpdate = (newSides: TeleClimbSide) => {
    const phase = isAuto ? "auto" : "tele";
    const toUpdate = currentForm[phase].climb;

    const update = {
      ...toUpdate,
      climbSide: newSides,
    };

    updateClimbForm(update);
  };

  const handleLevelAndTimeUpdate = (
    newLevel: TeleClimbLevel,
    newTimes: TeleClimbTime | AutoClimbTime,
  ) => {
    const phase = isAuto ? "auto" : "tele";
    const toUpdate = currentForm[phase].climb;

    const update: Climb =
      "L2" in newTimes
        ? {
            ...toUpdate,
            level: newLevel,
            climbTime: newTimes,
          }
        : {
            ...toUpdate,
            level: newLevel as AutoClimb["level"],
            climbTime: newTimes,
          };

    updateClimbForm(update);
  };
  const sideButton = (
    <ClimbSideButton
      climbSide={climbSide}
      setClimbSide={setClimbSide}
      submitClimbSides={handleSideUpdate}
      isAuto={isAuto}
    />
  );
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="flex flex-row items-start gap-16 bg-slate-900/60 p-12 rounded-[3rem] border border-white/10 shadow-2xl backdrop-blur-xl">
        {alliance === "blue" && sideButton}
        <ClimbLevelSlider
          isAuto={isAuto}
          onClimbLevelChange={setClimbLevel}
          setClimbTimes={setClimbTimes}
          climbTimes={climbTimes}
          originTime={originTime}
          submitClimbLevelAndTime={handleLevelAndTimeUpdate}
          climbLevel={climbLevel}
        />
        {alliance === "red" && sideButton}
      </div>
    </div>
  );
};
