// בס"ד
import type { FC, ForwardRefExoticComponent, RefAttributes } from "react";
import { Zap, Play, LayoutGrid, type LucideProps } from "lucide-react";
import type { GamePhase } from "@repo/scouting_types";

const ACTIVE_SIZE = 3;
const INACTIVE_SIZE = 2;
export const PhaseToggle: FC<{
  activeMode: GamePhase;
  setActiveMode: (phase: GamePhase) => void;
}> = ({ activeMode, setActiveMode }) => {
  const options: {
    id: GamePhase;
    label: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
  }[] = [
    { id: "auto", label: "Auto", icon: Play },
    { id: "tele", label: "Tele", icon: Zap },
    { id: "fullGame", label: "Full", icon: LayoutGrid },
  ];

  const handlePress = (mode: GamePhase) => {
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

            {/* Subtle indicator for active state */}
            {isActive && (
              <div className="absolute -bottom-1 w-1 h-1 bg-white rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};
