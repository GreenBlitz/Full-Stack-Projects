//בס"ד
import type React from "react";
import { useState } from "react";
import { ClimbLevelSlider } from "./ClimbLevelSlider";
import type {
  ClimbLevel,
  ClimbSide,
} from "../../../../../packages/scouting_types/rebuilt/Shift";
import { ClimbSideButton } from "./ClimbSideButton";

export const Climb: React.FC = () => {
  const [climbLevel, setClimbLevel] = useState<ClimbLevel>("none");
  const [climbSide, setClimbSide] = useState<ClimbSide>("none");

  return (
    <>
      <ClimbLevelSlider
        onClimbLevelChange={setClimbLevel}
        climbLevel={climbLevel}
      />

      <ClimbSideButton climbSide={climbSide} setClimbSide={setClimbSide} />
      <p>
        the robot climbed on to level {climbLevel} and usind the {climbSide}
      </p>
    </>
  );
};
