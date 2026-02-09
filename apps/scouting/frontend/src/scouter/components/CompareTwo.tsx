//בס"ד

import { firstElement, secondElement } from "@repo/array-functions";
import type { CompareData, TeamCompareData } from "@repo/scouting_types";
import type React from "react";
import { useEffect, useState } from "react";

const compareUrl = "/api/v1/compare/";

const MAX_SELECTED_TEAMS = 2;
const DEFAULT_LEVEL = 0;
const FIRST_INDEX = 0;

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

const fetchTeamNumbers = async () => {
  const url = `${compareUrl}teams`;

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
    return data.teamNumbers as number[];
  } catch (err) {
    console.error("Fetch failed:", err);
    throw err;
  }
};

const StatBox = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color: string;
}) => (
  <div
    className={`p-4 border-b flex flex-col items-center transition-colors ${color}`}
  >
    <span className="text-xs uppercase text-gray-500 font-bold">{label}</span>
    <span className="text-2xl font-black">{value}</span>
  </div>
);

const LevelMiniStat = ({ label, count }: { label: string; count: number }) => (
  <div className="flex flex-col items-center">
    <span className="text-[10px] font-bold text-gray-400">{label}</span>
    <span className="text-sm font-bold text-gray-700">{count}</span>
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
        : prev.length < MAX_SELECTED_TEAMS
          ? [...prev, selectedTeamNumber]
          : prev,
    );
  };

  const handleCompare = async () => {
    if (selectedTeams.length !== MAX_SELECTED_TEAMS) return;
    setIsLoading(true);
    try {
      const [firstTeam, secondTeam] = await Promise.all([
        fetchTeamCompareData(firstElement(selectedTeams)),
        fetchTeamCompareData(secondElement(selectedTeams)),
      ]);

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
    if (thisTeamStat === otherTeamStat) return "bg-gray-50";
    const isWinner = isHigherBetter
      ? thisTeamStat > otherTeamStat
      : thisTeamStat < otherTeamStat;
    return isWinner
      ? "bg-green-100 border-green-200"
      : "bg-red-100 border-red-200";
  };

  const levelToScore = (level: string) => {
    const map: Record<string, number> = { L0: 0, L1: 1, L2: 2, L3: 3 };
    return map[level] || DEFAULT_LEVEL;
  };

  return (
    <div className="flex flex-col gap-6 p-6 font-sans">
      <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
        {teamNumbers.map((teamNumber) => (
          <button
            key={teamNumber}
            onClick={() => {
              toggleTeamSelection(teamNumber);
            }}
            className={`px-4 py-2 rounded-lg transition-all border-2 ${
              selectedTeams.includes(teamNumber)
                ? "bg-blue-600 text-white border-blue-700"
                : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
            }`}
          >
            {teamNumber}
          </button>
        ))}
        <button
          onClick={() => {
            void handleCompare();
          }}
          disabled={selectedTeams.length !== MAX_SELECTED_TEAMS || isLoading}
          className="ml-auto px-8 py-2 bg-black text-white rounded-lg disabled:opacity-30 hover:bg-gray-800"
        >
          {isLoading ? "Loading..." : "Compare"}
        </button>
      </div>

      {comparisonData && (
        <div className="grid grid-cols-2 gap-4">
          {Object.values(comparisonData).map((team, idx) => {
            const other =
              idx === FIRST_INDEX
                ? comparisonData.teamTwo
                : comparisonData.teamOne;
            return (
              <div
                key={team.teamNumber}
                className="border rounded-2xl overflow-hidden shadow-sm"
              >
                <div className="bg-gray-800 text-white p-4 text-center text-2xl font-bold">
                  Team {team.teamNumber}
                </div>

                <StatBox
                  label="Average Fuel (Full Game)"
                  value={team.averageFuelInGame}
                  color={getStatColor(
                    team.averageFuelInGame,
                    other.averageFuelInGame,
                  )}
                />

                <StatBox
                  label="Average Fuel (Auto)"
                  value={team.averageFuelInAuto}
                  color={getStatColor(
                    team.averageFuelInAuto,
                    other.averageFuelInAuto,
                  )}
                />

                <div
                  className={`p-4 border-b flex flex-col items-center ${getStatColor(levelToScore(team.maxClimbLevel), levelToScore(other.maxClimbLevel))}`}
                >
                  <span className="text-xs uppercase text-gray-500 font-bold">
                    Max Climb Level
                  </span>
                  <span className="text-2xl font-black">
                    {team.maxClimbLevel}
                  </span>
                  <span className="text-xs text-gray-600 mt-1">
                    Reached {team.timesClimbedToMax} times
                  </span>

                  <div className="flex gap-4 mt-3 pt-2 border-t border-black/5 w-full justify-center">
                    <LevelMiniStat
                      label="L1"
                      count={team.timesClimbedToLevels.L1}
                    />
                    <LevelMiniStat
                      label="L2"
                      count={team.timesClimbedToLevels.L2}
                    />
                    <LevelMiniStat
                      label="L3"
                      count={team.timesClimbedToLevels.L3}
                    />
                  </div>
                </div>

                <StatBox
                  label="Auto Climbs"
                  value={team.timesClimbedInAuto}
                  color={getStatColor(
                    team.timesClimbedInAuto,
                    other.timesClimbedInAuto,
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
