// בס"ד

import { useState, type FC } from "react";
import type { Alliance } from "@repo/scouting_types";
import {
  SUPER_SCOUT_METRICS,
  SUPER_SCOUT_API_URL,
  createEmptyMetricSections,
  type MetricKey,
  type RatingValue,
  type TeamMetricSections,
  type MatchType,
} from "./metrics";
import { MetricCard } from "./MetricCard";
import { MatchInfoCard } from "./MatchInfoCard";

export const SuperScoutTab: FC = () => {
  const [matchNumber, setMatchNumber] = useState(0);
  const [matchType, setMatchType] = useState<MatchType>("qualification");
  const [alliance, setAlliance] = useState<Alliance>("red");
  const [metricSections, setMetricSections] = useState<TeamMetricSections>(
    createEmptyMetricSections,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateMetricRating = (
    key: MetricKey,
    rating: RatingValue | undefined,
  ) => {
    setMetricSections((prev) => ({
      ...prev,
      [key]: { ...prev[key], rating },
    }));
  };

  const updateMetricComment = (key: MetricKey, comment: string) => {
    setMetricSections((prev) => ({
      ...prev,
      [key]: { ...prev[key], info: comment || undefined },
    }));
  };

  const submitSuperScoutForm = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(SUPER_SCOUT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          match: { number: matchNumber, type: matchType },
          alliance,
          teams: metricSections,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(`Error submitting: ${errorText}`);
        return;
      }

      alert("Super scout data submitted!");
      setMetricSections(createEmptyMetricSections());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto pb-8">
      <MatchInfoCard
        matchNumber={matchNumber}
        matchType={matchType}
        alliance={alliance}
        onMatchNumberChange={setMatchNumber}
        onMatchTypeChange={setMatchType}
        onAllianceChange={setAlliance}
      />

      <div className="w-full flex flex-col gap-3">
        {SUPER_SCOUT_METRICS.map(({ key, label }) => (
          <MetricCard
            key={key}
            label={label}
            section={metricSections[key]}
            onRatingChange={(rating) => updateMetricRating(key, rating)}
            onCommentChange={(comment) => updateMetricComment(key, comment)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => {
          void submitSuperScoutForm();
        }}
        disabled={isSubmitting}
        className="px-12 py-3 bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl
          disabled:opacity-40 hover:bg-emerald-400 transition-all active:scale-95
          shadow-lg shadow-emerald-900/20"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};
