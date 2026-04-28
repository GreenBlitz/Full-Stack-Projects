//בס"ד

import type {
  PitScout,
  PitScoutNumberKey,
  SuperScout,
} from "@repo/scouting_types";
import type { FC } from "react";

interface NumberStatsProps {
  statKey: PitScoutNumberKey;
  label: string;
  placeholder: string;
  form: PitScout;
  setNumberForm: (key: PitScoutNumberKey, value: number) => void;
}

export const NumberStats: FC<NumberStatsProps> = ({
  statKey,
  label,
  placeholder,
  form,
  setNumberForm,
}) => {
  return (
    <div
      key={statKey}
      className="bg-slate-800/40 border border-white/5 p-5 rounded-2xl"
    >
      <label className="text-[10px] font-bold uppercase text-slate-500 block mb-2">
        {label}
      </label>
      <input
        type="number"
        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-amber-500/50 transition-all text-sm font-medium"
        value={form.numberMetrics[statKey] ?? ""}
        onChange={(event) =>
          setNumberForm(statKey, parseFloat(event.target.value))
        }
        placeholder={placeholder}
      />
    </div>
  );
};
