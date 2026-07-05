//בס"ד

import type { CompareData, TeamPageTeamBeeData } from "@repo/scouting_types";
import type React from "react";
import { useEffect, useState } from "react";
import { fetchTeamNumbers } from "../fetches";
import { fetchTeamData } from "./team/TeamTab";
import { useLocalStorage } from "@repo/local_storage_hook";
import { ThrowBarChart } from "./team/ThrowBarChart";
import { SuperBarChart } from "./team/SuperBarChart";

const superStats = ["defense", "evasion", "driving"] as const;

const NEEDED_SELECTED_TEAMS = 2;
const FIRST_INDEX = 0;

interface StatBoxProps {
  label: string;
  value: number | string;
  color: string;
}

const StatBox: React.FC<StatBoxProps> = ({ label, value, color }) => (
  <div
    className={`p-6 border-b border-white/5 flex flex-col items-center transition-all duration-300 ${color}`}
  >
    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">
      {label}
    </span>
    <span className="text-3xl font-black tabular-nums">{value}</span>
  </div>
);

export const CompareTwo: React.FC = () => {
  const [teamNumbers, setTeamNumbers] = useState<number[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);
  const [comparisonData, setComparisonData] = useState<CompareData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [recency, setRecency] = useLocalStorage<number | null>(
    "team/recency",
    null,
  );

  useEffect(() => {
    fetchTeamNumbers().then(setTeamNumbers).catch(console.error);
  }, []);

  const toggleTeamSelection = (selectedTeamNumber: number) => {
    setSelectedTeams((prev) =>
      prev.includes(selectedTeamNumber)
        ? prev.filter((teamNumber) => teamNumber !== selectedTeamNumber)
        : prev.length < NEEDED_SELECTED_TEAMS
          ? [...prev, selectedTeamNumber]
          : prev,
    );
  };

  const handleCompare = async () => {
    if (selectedTeams.length !== NEEDED_SELECTED_TEAMS) return;
    setIsLoading(true);
    try {
      const promises = selectedTeams.map((teamNumber) =>
        fetchTeamData(teamNumber, recency),
      );

      const [firstTeam, secondTeam] = await Promise.all(promises);
      if (!firstTeam || !secondTeam) {
        alert("team data not found");
        return;
      }

      setComparisonData({ teamOne: firstTeam, teamTwo: secondTeam });
    } catch (err) {
      console.error(`Failed to fetch team data: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatColor = (
    thisTeamStat: number,
    otherTeamStat: number,
    isHigherBetter = true,
  ) => {
    if (thisTeamStat === otherTeamStat) return "bg-slate-900/50 text-slate-400";
    const isWinner = isHigherBetter
      ? thisTeamStat > otherTeamStat
      : thisTeamStat < otherTeamStat;
    return isWinner
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : "bg-rose-500/5 text-rose-500/60 border-rose-500/10";
  };
  const getAutoPoints = (team: TeamPageTeamBeeData) =>
    Number(team.auto.fuelAverage.scored.toFixed(2));

  const getSuperRank = (
    team: TeamPageTeamBeeData,
    superStat: "defense" | "evasion" | "driving",
  ) => Number(team.super[superStat]?.toFixed(2));

  return (
    <div className="flex flex-col gap-8 p-8 bg-slate-950 min-h-screen text-slate-200">
      <div className="flex flex-col items-center gap-6 p-6 bg-slate-900/40 rounded-2xl border border-white/10 backdrop-blur-md">
        <div className="flex flex-col items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Select Teams
          </span>
          <div className="flex flex-wrap justify-center gap-3">
            {teamNumbers.map((teamNumber) => (
              <button
                key={teamNumber}
                onClick={() => {
                  toggleTeamSelection(teamNumber);
                }}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                  selectedTeams.includes(teamNumber)
                    ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-105"
                    : "bg-transparent text-slate-400 border-white/5 hover:border-emerald-500/50 hover:text-emerald-400"
                }`}
              >
                {teamNumber}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            void handleCompare();
          }}
          disabled={selectedTeams.length !== NEEDED_SELECTED_TEAMS || isLoading}
          className="px-12 py-3 bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl disabled:opacity-20 hover:bg-emerald-400 transition-all active:scale-95 shadow-lg shadow-emerald-900/20"
        >
          {isLoading ? "Loading..." : "Compare"}
        </button>
      </div>

      {comparisonData && (
        <div className="grid grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full overflow-x-auto">
          {Object.values(comparisonData).map(
            (team: TeamPageTeamBeeData, idx) => {
              const otherTeam =
                idx === FIRST_INDEX
                  ? comparisonData.teamTwo
                  : comparisonData.teamOne;
              return (
                <div
                  key={selectedTeams[idx]}
                  className="bg-slate-900/40 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm min-w-[300px]" // Added min-w to keep it readable if shrunk too far
                >
                  <div className="bg-slate-900 border-b border-white/10 py-6 text-center">
                    <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-emerald-500/60 block mb-1">
                      Scouting Report
                    </span>
                    <span className="text-4xl font-black text-white">
                      Team {selectedTeams[idx]}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 border-b border-white/5 divide-x divide-white/5">
                    <StatBox
                      label={"total points"}
                      value={team?.total.fuelAverage.scored.toFixed(2)}
                      color={getStatColor(
                        team?.total.fuelAverage.scored,
                        otherTeam?.total.fuelAverage.scored,
                      )}
                    />
                    <StatBox
                      label={"auto points"}
                      value={getAutoPoints(team)}
                      color={getStatColor(
                        getAutoPoints(team),
                        getAutoPoints(otherTeam),
                      )}
                    />
                  </div>

                  {team && (
                    <div className="w-full max-w-2xl my-5">
                      <ThrowBarChart
                        periodData={team.total}
                        max={400}
                        title="Full Game"
                      />
                    </div>
                  )}

                  {team && (
                    <div className="w-full max-w-2xl my-5">
                      <ThrowBarChart
                        periodData={team.auto}
                        max={70}
                        title="Auto"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
                    {superStats.map((stat) => (
                      <StatBox
                        key={stat}
                        label={stat}
                        value={getSuperRank(team, stat)}
                        color={getStatColor(
                          getSuperRank(team, stat),
                          getSuperRank(otherTeam, stat),
                        )}
                      />
                    ))}
                  </div>
                  {team && (
                    <div className="w-full max-w-2xl my-5">
                      <SuperBarChart superData={team.super} />
                    </div>
                  )}
                </div>
              );
            },
          )}
        </div>
      )}
    </div>
  );
};
