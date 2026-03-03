// בס"ד

import type { FC } from "react";
import {
  SUPER_SCOUT_METRICS,
  formInputStyles,
  type MetricKey,
  type RatingValue,
  type TeamSuperScoutData,
} from "./metrics";
import { MetricCard } from "./MetricCard";

interface TeamCardProps {
  teamIndex: number;
  teamData: TeamSuperScoutData;
  onTeamNumberChange: (teamNumber: number) => void;
  onRatingChange: (key: MetricKey, rating: RatingValue | undefined) => void;
  onCommentChange: (key: MetricKey, comment: string) => void;
}

export const TeamCard: FC<TeamCardProps> = ({
  teamIndex,
  teamData,
  onTeamNumberChange,
  onRatingChange,
  onCommentChange,
}) => (
  <div className="w-full bg-slate-900/30 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
    <div className="flex items-center gap-4">
      <span className="text-xs font-black uppercase tracking-widest text-amber-400">
        Team {teamIndex + 1}
      </span>
      <input
        type="number"
        value={teamData.teamNumber || ""}
        onChange={(e) => onTeamNumberChange(Number(e.target.value))}
        placeholder="Team #"
        min={1}
        className={`${formInputStyles} w-28 text-center`}
      />
    </div>

    <div className="flex flex-col gap-2">
      {SUPER_SCOUT_METRICS.map(({ key, label }) => (
        <MetricCard
          key={key}
          label={label}
          section={teamData[key]}
          onRatingChange={(rating) => onRatingChange(key, rating)}
          onCommentChange={(comment) => onCommentChange(key, comment)}
        />
      ))}
    </div>
  </div>
);
