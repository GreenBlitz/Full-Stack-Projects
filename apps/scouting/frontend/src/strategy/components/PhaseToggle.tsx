// בס"ד
import type { FC } from "react";
import { FiZap } from "react-icons/fi";
import type { GamePhase } from "@repo/scouting_types";
import type { IconType } from "react-icons/lib";
import { IoPlayOutline } from "react-icons/io5";
import { LuLayoutGrid } from "react-icons/lu";

const ACTIVE_SIZE = 3;
const INACTIVE_SIZE = 2;
export const PhaseToggle: FC<{
  activeMode: "pit" | "forms";
  setActiveMode: (phase: "pit" | "forms") => void;
}> = ({ activeMode, setActiveMode }) => {
  const options: {
    id: "pit" | "forms";
    label: string;
    icon: IconType;
  }[] = [
    { id: "pit", label: "Pit", icon: IoPlayOutline },
    { id: "forms", label: "Forms", icon: FiZap },
  ];

  const handlePress = (mode: "pit" | "forms") => {
    setActiveMode(mode);
  };

  return (
    <div className="w-full max-w-md mx-auto p-1 bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl flex gap-1">
      {options.map((option) => {
        const isActive = activeMode === option.id;
        const Icon = option.icon;

        return (
          <button
            key={option.id}
            onClick={() => {
              handlePress(option.id);
            }}
            className={`
              relative flex flex-1 items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300
              ${
                isActive
                  ? "bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }
            `}
          >
            <Icon
              size={16}
              strokeWidth={isActive ? ACTIVE_SIZE : INACTIVE_SIZE}
            />
            <span
              className={`text-xs font-black uppercase tracking-wider ${isActive ? "opacity-100" : "opacity-70"}`}
            >
              {option.label}
            </span>

            {isActive && (
              <div className="absolute -bottom-1 w-1 h-1 bg-white rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};
