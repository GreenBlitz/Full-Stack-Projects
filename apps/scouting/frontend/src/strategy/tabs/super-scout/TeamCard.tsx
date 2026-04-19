// בס"ד

import type { FC } from "react";
import type { SuperMetricKey, TeamSuperScout } from "@repo/scouting_types";
import { MetricCard } from "./MetricCard";

interface TeamCardProps {
  teamIndex: number;
  teamData: TeamSuperScout;
  updateTeam: (team: TeamSuperScout) => void;
}

export const superFormInputStyles =
  "w-full p-2.5 text-sm border border-white/10 rounded-xl bg-slate-800/40 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200";

const RATING_OPTIONS = [1, 2, 3, 4, 5, 6, 7];

export const TeamCard: FC<TeamCardProps> = ({
  teamIndex,
  teamData,
  updateTeam,
}) => (
  <div className="w-full bg-slate-900/30 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
    <div className="flex items-center gap-4">
      <span className="text-xs font-black uppercase tracking-widest text-amber-400">
        Team {teamIndex + 1}
      </span>
      <input
        type="number"
        value={teamData.teamNumber || ""}
        onChange={(e) =>
          updateTeam({
            ...teamData,
            teamNumber: parseInt(e.currentTarget.value),
          })
        }
        placeholder="Team #"
        min={1}
        className={`${superFormInputStyles} w-28 text-center`}
      />
    </div>

    <div className="flex flex-col gap-2">
      <MetricCard
        label={"Driving"}
        onChange={(text) =>
          updateTeam({
            ...teamData,
            driving: { comments: text, rating: teamData.driving.rating },
          })
        }
        text={teamData.driving.comments}
      >
        <div className="flex gap-2">
          {RATING_OPTIONS.map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() =>
                updateTeam({
                  ...teamData,
                  driving: {
                    rating:
                      teamData.driving.rating === rating
                        ? undefined
                        : (rating as TeamSuperScout["driving"]["rating"]),
                    comments: teamData.driving.comments,
                  },
                })
              }
              className={`w-10 h-10 rounded-xl text-sm font-black transition-all duration-200 border
              ${
                teamData.driving.rating === rating
                  ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  : "bg-slate-800/60 text-slate-400 border-white/5 hover:border-emerald-500/50 hover:text-emerald-400"
              }`}
            >
              {rating}
            </button>
          ))}
        </div>
      </MetricCard>
    </div>
  </div>
);
