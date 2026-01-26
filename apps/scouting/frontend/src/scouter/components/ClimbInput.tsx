//בס"ד
import type React from "react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { ClimbLevelSlider } from "./ClimbLevelSlider";
import type {
  Climb,
  AutoClimbTime,
  ClimbLevel,
  ClimbSide,
  ClimbTime,
} from "@repo/scouting_types";
import { ClimbSideButton } from "./ClimbSideButton";

interface ClimbProps {
  isAuto: boolean;
  submitClimbSides: (climbSide: ClimbSide, isAuto: boolean) => void;
  submitClimbLevelAndTime: (
    climbLevel: ClimbLevel,
    climbTimes: ClimbTime | AutoClimbTime,
    isAuto: boolean,
  ) => void;
  originTime: number;
}

export const ClimbInput: React.FC<ClimbProps> = ({
  isAuto,
  submitClimbSides,
  submitClimbLevelAndTime,
  originTime,
}) => {
  const [climbLevel, setClimbLevel] = useState<ClimbLevel>("L0");
  const [climbSide, setClimbSide] = useState<ClimbSide>({
    none: true,
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

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="flex flex-row items-start gap-16 bg-slate-900/60 p-12 rounded-[3rem] border border-white/10 shadow-2xl backdrop-blur-xl">
        <ClimbSideButton
          climbSide={climbSide}
          setClimbSide={setClimbSide}
          submitClimbSides={submitClimbSides}
          isAuto={isAuto}
        />
        <ClimbLevelSlider
          isAuto={isAuto}
          onClimbLevelChange={setClimbLevel}
          setClimbTimes={setClimbTimes}
          climbTimes={climbTimes}
          originTime={originTime}
          submitClimbLevelAndTime={submitClimbLevelAndTime}
          climbLevel={climbLevel}
        />
      </div>
    </div>
  );
};
