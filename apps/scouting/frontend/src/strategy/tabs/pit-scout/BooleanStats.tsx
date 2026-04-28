//בס"ד

import type { FC } from "react";
import type {
  PitScout,
  PitScoutBoolean,
  PitScoutBooleanKey,
  PitScoutBooleanMetric,
} from "@repo/scouting_types";

interface BooleanStatsProps {
  statKey: PitScoutBooleanKey;
  label: string;
  form: PitScout;
  setBoolForm: (key: PitScoutBooleanKey, value: PitScoutBooleanMetric) => void;
}

export const BooleanStats: FC<BooleanStatsProps> = ({
  statKey,
  label,
  form,
  setBoolForm,
}) => {
  return (
    <div key={statKey} className="flex items-center justify-between group">
      <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
        {label}
      </span>
      <div className="flex gap-2 bg-slate-900/80 p-1 rounded-xl border border-white/5">
        <button
          onClick={() => setBoolForm(statKey, true)}
          className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
            form.booleanMetrics[statKey] === true
              ? "bg-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          Yes
        </button>
        <button
          onClick={() => setBoolForm(statKey, false)}
          className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
            form.booleanMetrics[statKey] === false
              ? "bg-rose-500 text-slate-950 shadow-[0_0_10px_rgba(244,63,94,0.2)]"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          No
        </button>
      </div>
    </div>
  );
};
