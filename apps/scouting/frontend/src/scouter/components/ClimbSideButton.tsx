// בס"ד
import type React from "react";
import type { ClimbSide } from "@repo/scouting_types";
import { useEffect } from "react";

interface ClimbSideButtonProps {
  climbSide: ClimbSide;
  setClimbSide: React.Dispatch<React.SetStateAction<ClimbSide>>;
  submitClimbSides: (climbSides: ClimbSide, isAuto: boolean) => void;
  isAuto: boolean;
}

export const ClimbSideButton: React.FC<ClimbSideButtonProps> = ({
  climbSide,
  setClimbSide,
  submitClimbSides,
  isAuto,
}) => {
  const climbSideKeys = (Object.keys(climbSide) as (keyof ClimbSide)[]).filter(
    (side) => side !== "none",
  );

  useEffect(() => {
    submitClimbSides(climbSide, isAuto);
  }, [climbSide]);

  const handleToggle = (side: keyof ClimbSide) => {
    setClimbSide((prev) => {
      const nextState = {
        ...prev,
        [side]: !prev[side],
      };

      const isAnySelected = Object.entries(nextState)
        .filter(([key]) => key !== "none")
        .some(([key, value]) => value);

      return {
        ...nextState,
        none: !isAnySelected,
      };
    });
  };

  return (
    <div className="flex flex-col h-[200px] gap-2">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
        Side
      </span>
      <div className="flex flex-col flex-1 p-1 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner gap-1">
        {climbSideKeys.map((side) => (
          <button
            key={side}
            type="button"
            onClick={() => {
              handleToggle(side);
            }}
            className={`flex-1 w-26 px-2 py-1 text-[10px] font-black rounded-xl transition-all uppercase leading-none
              ${
                climbSide[side]
                  ? "bg-white text-green-600 shadow-sm border border-green-100 scale-[1.02]"
                  : "text-slate-400 hover:text-slate-600 opacity-60"
              }`}
          >
            {side}
          </button>
        ))}
      </div>
    </div>
  );
};
