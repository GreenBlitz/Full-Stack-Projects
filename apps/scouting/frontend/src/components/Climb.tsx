//בס"ד
import type React from "react";
import { useState } from "react";
import { ClimbLevelSlider } from "./ClimbLevelSlider";
import type {
  ClimbLevel,
  ClimbSide,
  ClimbTime,
} from "../../../../../packages/scouting_types/rebuilt/Shift";
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
    <>
      <ClimbLevelSlider
        onClimbLevelChange={setClimbLevel}
        setClimbTimes={setClimbTimes}
        climbLevel={climbLevel}
        climbTimes={climbTimes}
      />

      <ClimbSideButton climbSide={climbSide} setClimbSide={setClimbSide} />
    </>
  );
};
