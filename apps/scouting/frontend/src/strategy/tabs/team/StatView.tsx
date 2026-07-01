//בס"ד
import React from "react";

interface StatViewProps {
  statContent?: string;
  statName: string;
}

export const StatView: React.FC<StatViewProps> = ({
  statContent,
  statName,
}) => {
  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-4 rounded-2xl flex flex-col justify-between w-full min-h-[96px] shadow-lg">
      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1 truncate">
        {statName}
      </label>

      <span className="text-2xl sm:text-4xl font-black tracking-tight text-white block mt-auto break-all whitespace-normal">
        {statContent || "—"}
      </span>
    </div>
  );
};
