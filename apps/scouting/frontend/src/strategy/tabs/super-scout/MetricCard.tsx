// בס"ד

import type { FC } from "react";
import type { SuperRatingValue, SuperSection } from "@repo/scouting_types";
import { RATING_OPTIONS, formInputStyles } from "./metrics";

interface MetricCardProps {
  label: string;
  section: SuperSection;
  onRatingChange: (rating: SuperRatingValue | undefined) => void;
  onCommentChange: (comment: string) => void;
}

export const MetricCard: FC<MetricCardProps> = ({
  label,
  section,
  onRatingChange,
  onCommentChange,
}) => (
  <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <span className="text-sm font-black uppercase tracking-wider text-emerald-400">
        {label}
      </span>
      <div className="flex gap-2">
        {RATING_OPTIONS.map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() =>
              onRatingChange(section.rating === rating ? undefined : rating)
            }
            className={`w-10 h-10 rounded-xl text-sm font-black transition-all duration-200 border
              ${
                section.rating === rating
                  ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  : "bg-slate-800/60 text-slate-400 border-white/5 hover:border-emerald-500/50 hover:text-emerald-400"
              }`}
          >
            {rating}
          </button>
        ))}
      </div>
    </div>
    <textarea
      value={section.info ?? ""}
      onChange={(e) => onCommentChange(e.target.value)}
      placeholder={`Comments about ${label.toLowerCase()}...`}
      rows={2}
      className={`${formInputStyles} placeholder:text-slate-600 resize-none`}
    />
  </div>
);
