//בס"ד
import type React from "react";
import { useState } from "react";
import { ClimbLevelSlider } from "./ClimbLevelSlider";
import type {
  AutoClimbTime,
  ClimbLevel,
  ClimbSide,
  ClimbTime,
  ScoutingForm,
} from "@repo/scouting_types";
import { ClimbSideButton } from "./ClimbSideButton";
import type { Climb } from "../pages/tabs/ClimbTab";

interface InputClimbProps {
  isAuto: boolean;
  updateClimbForm: (updates: Climb) => void;
  originTime: number;
  currentForm: ScoutingForm;
}

export const ClimbInput: React.FC<InputClimbProps> = ({
  isAuto,
  updateClimbForm,
  originTime,
  currentForm,
}) => {
  const [climbLevel, setClimbLevel] = useState<ClimbLevel>("L0");
  const [climbSide, setClimbSide] = useState<ClimbSide>({
    middle: false,
    side: false,
    support: false,
  });
  const [climbTimes, setClimbTimes] = useState<AutoClimbTime | ClimbTime>(
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
  const handleSideUpdate = (newSides: ClimbSide) => {
    const phase = isAuto ? "auto" : "tele";
    const toUpdate = currentForm[phase].climb;

    const update = {
      ...toUpdate,
      climbSide: newSides,
    };

    updateClimbForm(update);
  };

  const handleLevelAndTimeUpdate = (
    newLevel: ClimbLevel,
    newTimes: ClimbTime | AutoClimbTime,
  ) => {
    const phase = isAuto ? "auto" : "tele";
    const toUpdate = currentForm[phase].climb;

    const update = {
      ...toUpdate,
      level: newLevel,
      climbTime: newTimes,
    };

    updateClimbForm(update);
  };
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="flex flex-row items-start gap-16 bg-slate-900/60 p-12 rounded-[3rem] border border-white/10 shadow-2xl backdrop-blur-xl">
        <ClimbSideButton
          climbSide={climbSide}
          setClimbSide={setClimbSide}
          submitClimbSides={handleSideUpdate}
          isAuto={isAuto}
        />
        <ClimbLevelSlider
          isAuto={isAuto}
          onClimbLevelChange={setClimbLevel}
          setClimbTimes={setClimbTimes}
          climbTimes={climbTimes}
          originTime={originTime}
          submitClimbLevelAndTime={handleLevelAndTimeUpdate}
          climbLevel={climbLevel}
        />
      </div>
    </div>
  );
};
