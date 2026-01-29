//בס"ד
import type React from "react";
import { useState } from "react";
import { ClimbLevelSlider } from "./ClimbLevelSlider";
import type {
  AutoClimbTime,
  TeleClimbLevel,
  TeleClimbSide,
  TeleClimbTime,
} from "@repo/scouting_types";
import { ClimbSideButton } from "./ClimbSideButton";

interface ClimbProps {
  isAuto: boolean;
}

const START_MATCH_TIME = 0;

export const Climb: React.FC<ClimbProps> = ({ isAuto }) => {
  const [climbLevel, setClimbLevel] = useState<TeleClimbLevel>("L0");
  const [climbSide, setClimbSide] = useState<TeleClimbSide[]>(["none"]);
  const [climbTimes, setClimbTimes] = useState<TeleClimbTime | AutoClimbTime>(
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
    <div className="flex flex-col items-center p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
      <div className="flex flex-row items-end gap-8 bg-white p-4">
        <ClimbSideButton climbSide={climbSide} setClimbSide={setClimbSide} />

        <ClimbLevelSlider
          isAuto={isAuto}
          onClimbLevelChange={setClimbLevel}
          setClimbTimes={setClimbTimes}
          climbTimes={climbTimes}
          originTime={START_MATCH_TIME}
        />
      </div>
    </div>
  );
};
