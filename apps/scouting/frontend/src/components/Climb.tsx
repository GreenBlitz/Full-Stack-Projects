//בס"ד
import type React from "react";
import { useState } from "react";
import { ClimbLevelSlider } from "./ClimbLevelSlider";
import type { ClimbLevel, ClimbSide, ClimbTime } from "@repo/scouting_types";
import { ClimbSideButton } from "./ClimbSideButton";

export const Climb: React.FC = () => {
  const [climbLevel, setClimbLevel] = useState<ClimbLevel>("none");
  const [climbSide, setClimbSide] = useState<ClimbSide[]>(["none"]);
  const [climbTimes, setClimbTimes] = useState<ClimbTime>({
    L1: null,
    L2: null,
    L3: null,
  });

 

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
      <div className="flex flex-row items-end gap-8 bg-white p-4">
        <ClimbSideButton climbSide={climbSide} setClimbSide={setClimbSide} />

        <ClimbLevelSlider
          onClimbLevelChange={setClimbLevel}
          setClimbTimes={setClimbTimes}
          climbLevel={climbLevel}
          climbTimes={climbTimes}
          originTime={0}
        />
      </div>
      
    </div>
  );
};
