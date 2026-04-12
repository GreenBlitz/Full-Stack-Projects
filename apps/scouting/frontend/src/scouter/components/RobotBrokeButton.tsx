// בס"ד
import type { FC } from "react";

interface RobotBrokenButtonProps {
  isRobotBroken: boolean;
  onChange: (value: boolean) => void;
}

export const RobotBrokenButton: FC<RobotBrokenButtonProps> = ({
  isRobotBroken: robotBroke,
  onChange,
}) => {
  return (
    <button
      type="button"
      className={`bg-${robotBroke ? "yellow-500" : "slate-800"} w-32 h-8 sm:h-10 md:h-12 px-2 text-xs shrink-0 rounded-xl transition-all duration-200 border-2 ${
        robotBroke
          ? "border-yellow-400 text-slate-900 shadow-[0_0_15px_rgba(234,179,8,0.5)] scale-[1.02]"
          : "border-white/10 text-slate-300"
      }`}
      onClick={() => {
        onChange(!robotBroke);
      }}
    >
      Robot Broke
    </button>
  );
};
