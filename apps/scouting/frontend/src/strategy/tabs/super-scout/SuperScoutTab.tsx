// בס"ד

import { useState, type FC } from "react";
import type { Alliance } from "@repo/scouting_types";
import {
  SUPER_SCOUT_API_URL,
  createEmptyAllianceTeams,
  type AllianceTeams,
  type MetricKey,
  type RatingValue,
  type MatchType,
  ALLIANCE_SIZE,
} from "./metrics";
import { TeamCard } from "./TeamCard";
import { MatchInfoCard } from "./MatchInfoCard";

type TeamIndex = 0 | 1 | 2;

export const SuperScoutTab: FC = () => {
  const [matchNumber, setMatchNumber] = useState(0);
  const [matchType, setMatchType] = useState<MatchType>("qualification");
  const [alliance, setAlliance] = useState<Alliance>("red");
  const [teams, setTeams] = useState<AllianceTeams>(createEmptyAllianceTeams);
  const [activeTeamIndex, setActiveTeamIndex] = useState<TeamIndex>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateTeamNumber = (teamIndex: TeamIndex, teamNumber: number) => {
    setTeams((prev) => {
      const updated = [...prev] as AllianceTeams;
      updated[teamIndex] = { ...updated[teamIndex], teamNumber };
      return updated;
    });
  };

  const updateTeamRating = (
    teamIndex: TeamIndex,
    key: MetricKey,
    rating: RatingValue | undefined,
  ) => {
    setTeams((prev) => {
      const updated = [...prev] as AllianceTeams;
      updated[teamIndex] = {
        ...updated[teamIndex],
        [key]: { ...updated[teamIndex][key], rating },
      };
      return updated;
    });
  };

  const updateTeamComment = (
    teamIndex: TeamIndex,
    key: MetricKey,
    comment: string,
  ) => {
    setTeams((prev) => {
      const updated = [...prev] as AllianceTeams;
      updated[teamIndex] = {
        ...updated[teamIndex],
        [key]: { ...updated[teamIndex][key], info: comment || undefined },
      };
      return updated;
    });
  };

  const submitSuperScoutForm = async () => {
    if (matchNumber <= 0) {
      alert("Please enter a valid match number.");
      return;
    }

    const invalidTeams = teams.filter((t) => t.teamNumber <= 0);
    if (invalidTeams.length > 0) {
      alert("Please enter valid team numbers for all 3 teams.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(SUPER_SCOUT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          match: { number: matchNumber, type: matchType },
          alliance,
          teams,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(`Error submitting: ${errorText}`);
        return;
      }

      alert("Super scout data submitted!");
      setMatchNumber(0);
      setTeams(createEmptyAllianceTeams());
    } catch {
      alert("Network error — check your connection and try again.");
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

      <div className="w-full flex gap-2">
        {Array.from({ length: ALLIANCE_SIZE }, (_, i) => i as TeamIndex).map(
          (index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveTeamIndex(index)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border
              ${
                activeTeamIndex === index
                  ? "bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                  : "bg-slate-800/40 text-slate-400 border-white/5 hover:border-amber-500/50"
              }`}
            >
              Team {index + 1}
              {teams[index].teamNumber > 0 && (
                <span className="ml-1.5 opacity-70">
                  #{teams[index].teamNumber}
                </span>
              )}
            </button>
          ),
        )}
      </div>

      <TeamCard
        teamIndex={activeTeamIndex}
        teamData={teams[activeTeamIndex]}
        onTeamNumberChange={(num) => updateTeamNumber(activeTeamIndex, num)}
        onRatingChange={(key, rating) =>
          updateTeamRating(activeTeamIndex, key, rating)
        }
        onCommentChange={(key, comment) =>
          updateTeamComment(activeTeamIndex, key, comment)
        }
      />

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
        {isSubmitting ? "Submitting..." : "Submit All Teams"}
      </button>
    </div>
  );
};
