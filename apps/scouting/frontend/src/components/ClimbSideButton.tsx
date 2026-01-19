//בס"ד

import type React from "react";
import {
  climbSideValues,
  type ClimbSide,
} from "../../../../../packages/scouting_types/rebuilt/Shift";

interface ClimbSideButtonProps {
  climbSide: ClimbSide;
  setClimbSide: (ClimbSide: ClimbSide) => void;
}

export const ClimbSideButton: React.FC<ClimbSideButtonProps> = ({
  climbSide,
  setClimbSide,
}) => {
    const climbSideValuesNoNone = climbSideValues.filter(side => side !== "none");

  return (
    <>
      {climbSideValuesNoNone.map((side) => (
        <button
          key={side}
          type="button"
          onClick={() => {
            setClimbSide(side);
          }}
          className={climbSide === side ? "bg-green-500" : "bg-gray-200"}
        >
          {side}
        </button>
      ))}
    </>
  );
};
