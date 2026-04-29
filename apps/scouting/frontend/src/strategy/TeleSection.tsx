// בס"ד
// TeleSection.tsx

import type { FC } from "react";

interface TeleField {
  rating: number | undefined;
  description: string;
}

interface TeleSectionProps {
  label: string;
  data: TeleField | undefined;
}

export const TeleSection: FC<TeleSectionProps> = ({ label, data }) => {
  if (!data) return null;

  return (
    <div className="bg-slate-800/40 border border-white/5 p-5 rounded-2xl flex flex-col gap-3">
      <label className="text-[10px] font-bold uppercase text-slate-500 block">
        {label}
      </label>
      {data.rating !== undefined && (
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase text-slate-500">
            Rating
          </span>
          <div className="flex gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-sm ${
                  i < data.rating! ? "bg-amber-500" : "bg-slate-700"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-mono text-slate-300">
            {data.rating}/7
          </span>
        </div>
      )}
      {data.description && (
        <p className="text-sm text-slate-200 bg-slate-900/50 border border-white/5 rounded-xl px-4 py-2">
          {data.description}
        </p>
      )}
    </div>
  );
};
