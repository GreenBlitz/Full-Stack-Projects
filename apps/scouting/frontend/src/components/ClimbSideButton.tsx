// בס"ד
import type React from "react";
import {
  climbSideValues,
  type ClimbSide,
} from "../../../../../packages/scouting_types/rebuilt/Shift";

interface ClimbSideButtonProps {
  climbSide: ClimbSide[];
  setClimbSide: React.Dispatch<React.SetStateAction<ClimbSide[]>>;
}

export const ClimbSideButton: React.FC<ClimbSideButtonProps> = ({
  climbSide,
  setClimbSide,
}) => {
  const climbSideValuesNoNone = climbSideValues.filter(
    (side) => side !== "none",
  );

  const FIRST_STRING_INDEX = 0;
  const SECOND_STRING_INDEX = 1;

  const handleToggle = (side: ClimbSide) => {
    setClimbSide((prev) =>
      prev.includes(side)
        ? prev.filter((currentSide) => currentSide !== side)
        : [...prev, side],
    );
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-6">
      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
        Climb Sides
      </span>

      <div className="inline-flex p-1 bg-gray-100 rounded-xl border border-gray-200 shadow-inner gap-1">
        {climbSideValuesNoNone.map((side) => {
          const isActive = climbSide.includes(side);

          return (
            <button
              key={side}
              type="button"
              onClick={() => {
                handleToggle(side);
              }}
              className={`
                px-6 py-2 text-sm font-bold rounded-lg transition-all duration-200
                ${
                  isActive
                    ? "bg-white text-green-500 shadow-md transform scale-105 border border-green-100"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50 border border-transparent"
                }
              `}
            >
              {side.charAt(FIRST_STRING_INDEX).toUpperCase() +
                side.slice(SECOND_STRING_INDEX)}
            </button>
          );
        })}
      </div>
    </div>
  );
};
