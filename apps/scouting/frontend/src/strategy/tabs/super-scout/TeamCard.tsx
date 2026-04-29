// בס"ד

import type { FC } from "react";
import type { SuperMetricKey, TeamSuperScout } from "@repo/scouting_types";
import { MetricCard } from "./MetricCard";

interface TeamCardProps {
  teamData: TeamSuperScout;
  updateTeam: (team: TeamSuperScout) => void;
}

export const superFormInputStyles =
  "w-full p-2.5 text-sm border border-white/10 rounded-xl bg-slate-800/40 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200";

export const TeamCard: FC<TeamCardProps> = ({ teamData, updateTeam }) => (
  <div className="w-full bg-slate-900/30 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
    <div className="flex flex-col gap-2">
      <MetricCard
        label={"Driving"}
        onTextChange={(text) =>
          updateTeam({
            ...teamData,
            driving:
              text.length < 1 && !teamData.driving?.rating
                ? undefined
                : {
                    description: text,
                    rating: teamData.driving?.rating,
                  },
          })
        }
        text={teamData.driving?.description ?? ""}
        onRatingChange={(rating) =>
          updateTeam({
            ...teamData,
            driving:
              rating === undefined &&
              (teamData.driving?.description.length ?? 0) < 1
                ? undefined
                : {
                    rating:
                      teamData.driving?.rating === rating
                        ? undefined
                        : (rating as any),
                    description: teamData.driving?.description ?? "",
                  },
          })
        }
        currentRating={teamData.driving?.rating}
      />
      <MetricCard
        label={"Defense"}
        onTextChange={(text) =>
          updateTeam({
            ...teamData,
            defense:
              text.length < 1 && !teamData.defense?.rating
                ? undefined
                : {
                    description: text,
                    rating: teamData.defense?.rating,
                  },
          })
        }
        text={teamData.defense?.description ?? ""}
        onRatingChange={(rating) =>
          updateTeam({
            ...teamData,
            defense:
              rating === undefined &&
              (teamData.driving?.description.length ?? 0) < 1
                ? undefined
                : {
                    rating:
                      teamData.defense?.rating === rating
                        ? undefined
                        : (rating as any),
                    description: teamData.defense?.description ?? "",
                  },
          })
        }
        currentRating={teamData.defense?.rating}
      />
      <MetricCard
        label={"Evasion"}
        onTextChange={(text) =>
          updateTeam({
            ...teamData,
            evasion:
              text.length < 1 && !teamData.evasion?.rating
                ? undefined
                : {
                    description: text,
                    rating: teamData.evasion?.rating,
                  },
          })
        }
        text={teamData.evasion?.description ?? ""}
        onRatingChange={(rating) =>
          updateTeam({
            ...teamData,
            evasion:
              rating === undefined &&
              (teamData.driving?.description.length ?? 0) < 1
                ? undefined
                : {
                    rating:
                      teamData.evasion?.rating === rating
                        ? undefined
                        : (rating as any),
                    description: teamData.evasion?.description ?? "",
                  },
          })
        }
        currentRating={teamData.evasion?.rating}
      />
    </div>
  </div>
);
