// בס"ד

import type { FC } from "react";
import type { Alliance } from "@repo/scouting_types";
import { formInputStyles, type MatchType } from "./metrics";

interface MatchInfoCardProps {
  matchNumber: number;
  matchType: MatchType;
  alliance: Alliance;
  onMatchNumberChange: (num: number) => void;
  onMatchTypeChange: (type: MatchType) => void;
  onAllianceChange: (alliance: Alliance) => void;
}

export const MatchInfoCard: FC<MatchInfoCardProps> = ({
  matchNumber,
  matchType,
  alliance,
  onMatchNumberChange,
  onMatchTypeChange,
  onAllianceChange,
}) => (
  <div className="w-full bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6">
    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 block mb-4">
      Match Info
    </span>
    <div className="grid grid-cols-3 gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
          Match #
        </label>
        <input
          type="number"
          value={matchNumber || ""}
          onChange={(e) => onMatchNumberChange(Number(e.target.value))}
          min={0}
          className={formInputStyles}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
          Type
        </label>
        <select
          value={matchType}
          onChange={(e) => onMatchTypeChange(e.target.value as MatchType)}
          className={formInputStyles}
        >
          <option value="practice">Practice</option>
          <option value="qualification">Qualification</option>
          <option value="playoff">Playoff</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
          Alliance
        </label>
        <div className="flex gap-2 h-full">
          <button
            type="button"
            onClick={() => onAllianceChange("red")}
            className={`flex-1 rounded-xl text-sm font-bold transition-all border
              ${
                alliance === "red"
                  ? "bg-red-500 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                  : "bg-slate-800/40 text-slate-400 border-white/5 hover:border-red-500/50"
              }`}
          >
            Red
          </button>
          <button
            type="button"
            onClick={() => onAllianceChange("blue")}
            className={`flex-1 rounded-xl text-sm font-bold transition-all border
              ${
                alliance === "blue"
                  ? "bg-blue-500 text-white border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                  : "bg-slate-800/40 text-slate-400 border-white/5 hover:border-blue-500/50"
              }`}
          >
            Blue
          </button>
        </div>
      </div>
    </div>
  </div>
);
