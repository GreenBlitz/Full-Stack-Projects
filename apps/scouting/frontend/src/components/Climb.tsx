//בס"ד
import type React from "react";
import { useState } from "react";
import { ClimbLevelSlider } from "./ClimbLevelSlider";
import type { ClimbLevel, ClimbSide, ClimbTime } from "@repo/scouting_types";
import { ClimbSideButton } from "./ClimbSideButton";

export const Climb: React.FC = () => {
  const [climbLevel, setClimbLevel] = useState<ClimbLevel>("L0");
  const [climbSide, setClimbSide] = useState<ClimbSide[]>(["none"]);
  const [climbTimes, setClimbTimes] = useState<ClimbTime>({
    L1: null,
    L2: null,
    L3: null,
  });

  const getTime = (ms: number | undefined) =>
    ms ? new Date(ms).toLocaleTimeString() : "N/A";

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
      <div className="flex flex-row items-end gap-8 bg-white p-4">
        <ClimbSideButton climbSide={climbSide} setClimbSide={setClimbSide} />

        <ClimbLevelSlider
          onClimbLevelChange={setClimbLevel}
          setClimbTimes={setClimbTimes}
          climbTimes={climbTimes}
          originTime={0}
        />
      </div>
      <div className="mt-4 p-4 bg-gray-100 rounded text-xs font-mono">
        <h4 className="font-bold mb-2">Climb Logs:</h4>
        <p>
          L1: {getTime(climbTimes.L1?.start)} → {getTime(climbTimes.L1?.end)}
        </p>
        <p>
          L2: {getTime(climbTimes.L2?.start)} → {getTime(climbTimes.L2?.end)}
        </p>
        <p>
          L3: {getTime(climbTimes.L3?.start)} → {getTime(climbTimes.L3?.end)}
        </p>
      </div>
    </div>
  );
};
