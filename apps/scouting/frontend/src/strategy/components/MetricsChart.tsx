// בס"ד

import type { FC } from "react";
import type { TeamData } from "@repo/scouting_types";

const Metric: FC<{ name: string; value: number; colors: string }> = ({
  name,
  value,
  colors,
}) => (
  <div
    className={`flex flex-col items-center text-center justify-center p-4 rounded-2xl border-2 transition-all shadow-lg 
          ${colors}`}
  >
    <span className="text-xl uppercase tracking-widest opacity-70 font-black mb-1">
      {name}
    </span>
    <span className="text-3xl font-black">{value}</span>
  </div>
);

export const MetricsChart: FC<TeamData["metrics"]> = ({ epa, bps }) => {
  return (
    <div className="grid grid-cols-2 gap-3 w-full max-w-md mx-auto p-2">
      <Metric
        name="EPA"
        value={epa}
        colors="bg-cyan-500/20 border-cyan-500/50 text-cyan-200"
      />
      <Metric
        name="BPS"
        value={bps}
        colors="bg-purple-500/20 border-purple-500/50 text-purple-200"
      />
    </div>
  );
};
