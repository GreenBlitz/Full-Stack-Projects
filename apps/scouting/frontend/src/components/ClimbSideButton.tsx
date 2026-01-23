// בס"ד
import type React from "react";
import { climbSideValues, type ClimbSide } from "@repo/scouting_types";

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


  const handleToggle = (side: ClimbSide) => {
    setClimbSide((prev) =>
      prev.includes(side)
        ? prev.filter((currentSide) => currentSide !== side)
        : [...prev, side],
    );
  };

  return (
    <div className="flex flex-col h-[200px] gap-2">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
        Side
      </span>
      <div className="flex flex-col flex-1 p-1 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner gap-1">
        {climbSideValuesNoNone.map((side) => {
          const isActive = climbSide.includes(side);
          return (
            <button
              key={side}
              type="button"
              onClick={() => {
                handleToggle(side);
              }}
              className={`flex-1 w-26 px-2 py-1 text-[10px] font-black rounded-xl transition-all uppercase leading-none
                ${
                  isActive
                    ? "bg-white text-green-600 shadow-sm border border-green-100 scale-[1.02]"
                    : "text-slate-400 hover:text-slate-600 opacity-60"
                }`}
            >
              {side}
            </button>
          );
        })}
      </div>
    </div>
  );
};
