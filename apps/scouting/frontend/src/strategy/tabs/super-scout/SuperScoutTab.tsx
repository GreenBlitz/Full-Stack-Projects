// בס"ד

import { useState, type FC } from "react";
import { type Alliance, type MatchType } from "@repo/scouting_types";
import { TeamCard } from "./TeamCard";
import { MatchInfoCard } from "./MatchInfoCard";

type TeamIndex = 0 | 1 | 2;

const createEmptyAllianceTeam = () => ({
  active: "",
  inactive: "",
  driving: {
    comments: "",
    rating: null,
  },
  faults: "",
  teamNumber: 0,
});

const ALLIANCE_SIZE = 3;
const createEmptyAllianceTeams = () => [
  createEmptyAllianceTeam(),
  createEmptyAllianceTeam(),
  createEmptyAllianceTeam(),
];

export const SuperScoutTab: FC = () => {
  const [matchNumber, setMatchNumber] = useState(0);
  const [matchType, setMatchType] = useState<MatchType>("qualification");
  const [alliance, setAlliance] = useState<Alliance>("red");
  const [teams, setTeams] = useState<any>(createEmptyAllianceTeams);
  const [activeTeamIndex, setActiveTeamIndex] = useState<TeamIndex>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitSuperScoutForm = async () => {
    if (matchNumber <= 0) {
      alert("Please enter a valid match number.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/v1/super", {
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
        updateTeam={(team) =>
          setTeams((prev: any) => {
            const copy = [...prev];
            copy[activeTeamIndex] = team;
            return copy;
          })
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
