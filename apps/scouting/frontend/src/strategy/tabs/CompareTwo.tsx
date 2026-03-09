//בס"ד

import type {
  CompareData,
  TeamCompareData,
  TeleClimbLevel,
} from "@repo/scouting_types";
import type React from "react";
import { useEffect, useState, type FC } from "react";
import { fetchTeamNumbers } from "../fetches";

const compareUrl = "/api/v1/compare/";

const NEEDED_SELECTED_TEAMS = 2;
const DEFAULT_LEVEL = 0;
const FIRST_INDEX = 0;
const MIN_AMOUNT_CLIMB = 0;

const fetchTeamCompareData = async (teamNumber: number) => {
  const params = new URLSearchParams({ teamNumber: teamNumber.toString() });
  const url = `${compareUrl}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server Error: ${errorText}`);
    }

    const data = await response.json();
    return data.teamCompareData as TeamCompareData;
  } catch (err) {
    console.error("Fetch failed:", err);
    throw err;
  }
};

interface StatBoxProps {
  label: string;
  value: number | string;
  color: string;
}

interface LevelMiniStatProps {
  label: string;
  count: number;
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

const LevelMiniStat: FC<LevelMiniStatProps> = ({ label, count }) => (
  <div className="flex flex-col items-center px-3">
    <span className="text-[10px] font-black text-slate-500 mb-0.5">
      {label}
    </span>
    <span
      className={`text-base font-bold ${count > MIN_AMOUNT_CLIMB ? "text-emerald-400" : "text-slate-700"}`}
    >
      {count}
    </span>
  </div>
);

export const CompareTwo: React.FC = () => {
  const [teamNumbers, setTeamNumbers] = useState<number[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);
  const [comparisonData, setComparisonData] = useState<CompareData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

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
        fetchTeamCompareData(teamNumber),
      );

      const [firstTeam, secondTeam] = await Promise.all(promises);

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

  const levelToScore = (level: TeleClimbLevel) => {
    const map: Record<string, number> = { L0: 0, L1: 1, L2: 2, L3: 3 };
    return map[level] || DEFAULT_LEVEL;
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {Object.values(comparisonData).map((team: TeamCompareData, idx) => {
            const other =
              idx === FIRST_INDEX
                ? comparisonData.teamTwo
                : comparisonData.teamOne;
            return (
              <div
                key={team.teamNumber}
                className="bg-slate-900/40 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm"
              >
                <div className="bg-slate-900 border-b border-white/10 py-6 text-center">
                  <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-emerald-500/60 block mb-1">
                    Scouting Report
                  </span>
                  <span className="text-4xl font-black text-white">
                    Team {team.teamNumber}
                  </span>
                </div>

                <StatBox
                  label="Average Fuel (Full Game)"
                  value={team.averageFuel.averageFuelInGame}
                  color={getStatColor(
                    team.averageFuel.averageFuelInGame,
                    other.averageFuel.averageFuelInGame,
                  )}
                />

                <StatBox
                  label="Average Fuel (Auto)"
                  value={team.averageFuel.averageFuelInAuto}
                  color={getStatColor(
                    team.averageFuel.averageFuelInAuto,
                    other.averageFuel.averageFuelInAuto,
                  )}
                />

                <div
                  className={`p-6 border-b border-white/5 flex flex-col items-center transition-all duration-300 ${getStatColor(levelToScore(team.climb.maxClimbLevel), levelToScore(other.climb.maxClimbLevel))}`}
                >
                  <span className="text-[10px] uppercase tracking-widest font-bold mb-1 opacity-60">
                    Max Climb Level
                  </span>
                  <span className="text-4xl font-black">
                    {team.climb.maxClimbLevel}
                  </span>
                  <span className="text-[11px] font-bold opacity-50 mt-1 uppercase tracking-tighter">
                    Reached {team.climb.timesClimbedToMax} times
                  </span>

                  <div className="flex gap-2 mt-5 p-3 bg-black/40 rounded-2xl w-full justify-center border border-white/5">
                    <LevelMiniStat
                      label="L1"
                      count={team.climb.timesClimbedToLevels.L1}
                    />
                    <div className="w-px h-8 bg-white/5 self-center" />
                    <LevelMiniStat
                      label="L2"
                      count={team.climb.timesClimbedToLevels.L2}
                    />
                    <div className="w-px h-8 bg-white/5 self-center" />
                    <LevelMiniStat
                      label="L3"
                      count={team.climb.timesClimbedToLevels.L3}
                    />
                  </div>
                </div>

                <StatBox
                  label="Auto Climbs"
                  value={team.climb.timesClimbedInAuto}
                  color={getStatColor(
                    team.climb.timesClimbedInAuto,
                    other.climb.timesClimbedInAuto,
                  )}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
