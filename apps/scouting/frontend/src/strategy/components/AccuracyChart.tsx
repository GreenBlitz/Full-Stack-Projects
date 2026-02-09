// בס"ד
import type { FC } from "react";
import { Target, Crosshair, Locate } from "lucide-react";
import { firstElement } from "@repo/array-functions";

interface AccuracyChartProps {
  metrics: {
    meter: number;
    twoMeter: number;
    more: number;
  };
}

const LOW_ACCURACY_THRESHOLD = 0.4;
const MEDIUM_ACCURACY_THRESHOULD = 0.7;
const PERCENT_SCALING_FACTOR = 100;
const ICON_SIZE = 30;

export const AccuracyChart: FC<AccuracyChartProps> = ({ metrics }) => {
  const getProgressColor = (percent: number) => {
    if (percent < LOW_ACCURACY_THRESHOLD)
      return "text-rose-500 stroke-rose-500/20";
    if (percent < MEDIUM_ACCURACY_THRESHOULD)
      return "text-yellow-500 stroke-yellow-500/20";
    return "text-emerald-500 stroke-emerald-500/20";
  };

  const cards = [
    {
      label: "Meter",
      value: metrics.meter,
      icon: <Target size={ICON_SIZE} />,
    },
    {
      label: "2 Meter",
      value: metrics.twoMeter,
      icon: <Crosshair size={ICON_SIZE} />,
    },
    {
      label: "More",
      value: metrics.more,
      icon: <Locate size={ICON_SIZE} />,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-md mx-auto">
      {cards.map((card) => (
        <div
          key={card.label}
          className="relative overflow-hidden bg-slate-900/40 backdrop-blur-md border border-white/5 p-3 rounded-2xl flex flex-col items-center gap-1 shadow-xl"
        >
          {/* Subtle Background Glow */}

          <div
            className={`absolute -bottom-4 -right-4 w-12 h-12 blur-2xl opacity-20 rounded-full ${firstElement(getProgressColor(card.value).split(" ")).replace("text", "bg")}`}
          />

          <div className="flex items-center gap-1.5 text-sm font-black uppercase tracking-tighter text-slate-500">
            {card.icon}
            {card.label}
          </div>

          <div
            className={`text-2xl font-black tracking-tighter ${firstElement(getProgressColor(card.value).split(" "))}`}
          >
            {Math.round(card.value * PERCENT_SCALING_FACTOR)}
            <span className="text-xs ml-0.5 opacity-60">%</span>
          </div>

          {/* Mini progress bar at the bottom */}
          <div className="w-full h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${firstElement(getProgressColor(card.value).split(" ")).replace("text", "bg")}`}
              style={{ width: `${card.value * PERCENT_SCALING_FACTOR}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
