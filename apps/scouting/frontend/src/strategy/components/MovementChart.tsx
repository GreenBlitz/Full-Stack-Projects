// בס"ד
import type { FC } from "react";
import type {
  AutoMovement,
  Movement,
  TeleMovement,
} from "@repo/scouting_types";

type CountedMovement<M extends Movement> = Record<keyof M, number>;

interface MovementChartProps {
  movements: CountedMovement<AutoMovement> | CountedMovement<TeleMovement>;
}

const RED_COLOR_AMOUNT = 0;
const ORANGE_COLOR_AMOUNT = 1;
const YELLOW_COLOR_AMOUNT = 2;

const TELE_MOVEMENT_AMOUNT = 1;

export const MovementChart: FC<MovementChartProps> = ({ movements }) => {
  // Helper to determine color based on count
  const getBgColor = (count: number) => {
    if (count === RED_COLOR_AMOUNT)
      return "bg-rose-500/20 border-rose-500/50 text-rose-200";
    if (count === ORANGE_COLOR_AMOUNT)
      return "bg-orange-500/20 border-orange-500/50 text-orange-200";
    if (count === YELLOW_COLOR_AMOUNT)
      return "bg-yellow-500/20 border-yellow-500/50 text-yellow-200";
    return "bg-emerald-500/20 border-emerald-500/50 text-emerald-200";
  };

  // Helper to format labels (e.g., trenchPass -> Trench Pass)
  const formatLabel = (label: string) => {
    return label
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-md mx-auto p-2">
      {Object.entries(movements).map(([key, value], index, arr) => (
        <div
          key={key}
          className={`flex flex-col ${arr.length === TELE_MOVEMENT_AMOUNT ? "col-start-2" : ""} items-center text-center justify-center p-4 rounded-2xl border-2 transition-all shadow-lg ${getBgColor(
            value,
          )}`}
        >
          <span className="text-xl uppercase tracking-widest opacity-70 font-black mb-1">
            {formatLabel(key)}
          </span>
          <span className="text-3xl font-black">{value}</span>
        </div>
      ))}
    </div>
  );
};
