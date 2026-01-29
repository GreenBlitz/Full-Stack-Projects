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
  const climbSideKeys = Object.keys(climbSide) as (keyof ClimbSide)[];

  useEffect(() => {
    submitClimbSides(climbSide, isAuto);
  }, [climbSide]);

  const handleToggle = (side: keyof ClimbSide) => {
    setClimbSide((prev) => {
      const nextState = {
        ...prev,
        [side]: !prev[side],
      };

      const isAnySelected = Object.entries(nextState).some(
        ([key, value]) => value,
      );

      return {
        ...nextState,
      };
    });
  };

  return (
    <div className="flex flex-col h-[240px] gap-4">
      <span className="text-[12px] font-bold text-slate-300 uppercase tracking-[0.2em] text-center opacity-80">
        Side
      </span>
      <div className="flex flex-col flex-1 p-2 bg-black/30 rounded-3xl border border-white/5 shadow-inner gap-2">
        {climbSideKeys.map((side) => (
          <button
            key={side}
            type="button"
            onClick={() => {
              handleToggle(side);
            }}
            className={`flex-1 w-32 px-4 py-2 text-[12px] font-black rounded-2xl transition-all uppercase border-2
              ${
                climbSide[side]
                  ? "bg-green-400 text-slate-900 border-green-300 shadow-[0_0_20px_rgba(74,222,128,0.5)] scale-[1.05]"
                  : "text-slate-100 border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20"
              }`}
          >
            {side}
          </button>
        ))}
      </div>
    </div>
  );
};
