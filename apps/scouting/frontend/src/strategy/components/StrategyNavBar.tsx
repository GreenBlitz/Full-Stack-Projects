// בס"ד
import type { FC } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { LuTable, LuSwords } from "react-icons/lu";
import { AiOutlineTeam } from "react-icons/ai";
import type { IconType } from "react-icons/lib";
import { TiWeatherCloudy } from "react-icons/ti";

const NavigationElement: FC<NavigationElementProps> = ({
  isActive,
  Icon,
  label,
}) => (
  <>
    <Icon size={18} strokeWidth={isActive ? ACTIVE_SIZE : INACTIVE_SIZE} />
    <span
      className={`text-xs font-black uppercase tracking-wider ${
        isActive ? "opacity-100" : "opacity-70"
      }`}
    >
      {label}
    </span>
  </>
);

const ACTIVE_SIZE = 3;
const INACTIVE_SIZE = 2;

interface NavigationOption {
  destination: string;
  label: string;
  icon: IconType;
}
const strategyNavigationOptions: NavigationOption[] = [
  { destination: "team", label: "Team", icon: AiOutlineTeam },
  { destination: "general", label: "General", icon: LuTable },
  { destination: "compare", label: "Compare", icon: LuSwords },
  { destination: "forecast", label: "Forecast", icon: TiWeatherCloudy },
];

interface NavigationElementProps {
  isActive: boolean;
  Icon: IconType;
  label: string;
}

export const StrategyNavigationBar: FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <div className="p-4 border-b border-white/5 bg-slate-900/40 sticky top-0 z-50 backdrop-blur-md">
        <div className="w-full max-w-2xl mx-auto p-1 bg-slate-900/60 border border-white/10 rounded-2xl flex gap-1">
          {strategyNavigationOptions.map((option) => (
            <NavLink
              key={option.destination}
              to={option.destination}
              className={({ isActive }) => `
                  relative flex flex-1 items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300
                  ${
                    isActive
                      ? "bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }
                `}
            >
              {({ isActive }) => (
                <NavigationElement
                  isActive={isActive}
                  Icon={option.icon}
                  label={option.label}
                />
              )}
            </NavLink>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};
