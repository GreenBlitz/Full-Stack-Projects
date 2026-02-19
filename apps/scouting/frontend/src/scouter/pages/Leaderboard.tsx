// בס"ד

import type React from "react";
import { useMemo, useState, useEffect } from "react";
import type { Competition, CompetitionScouters } from "@repo/scouting_types";
import { isEmpty } from "@repo/array-functions";

const leaderboardUrl = "/api/v1/leaderboard/";

export const scouterColor: Record<string, string> = {
  Levi: "text-purple-400",
  karni: "text-green-800",
  Roni: "text-pink-300",
};

const fetchCompetitionData = async (competition: Competition) => {
  const params = new URLSearchParams({ competition: competition });
  const url = `${leaderboardUrl}?${params.toString()}`;

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
    return data.competitionScouters as CompetitionScouters;
  } catch (err) {
    console.error("Fetch failed:", err);
    throw err;
  }
};

interface ScouterLeaderboardProps {
  competition: Competition;
}

export const Leaderboard: React.FC<ScouterLeaderboardProps> = ({
  competition,
}) => {
  const [data, setData] = useState<CompetitionScouters | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    fetchCompetitionData(competition)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [competition]);

  const sortedScouters = useMemo(() => {
    if (!data?.Scouters) return [];
    return [...data.Scouters].sort((scouter1, scouter2) => {
      if (scouter2.scoutedMatches !== scouter1.scoutedMatches) {
        return scouter2.scoutedMatches - scouter1.scoutedMatches;
      }
      return scouter1.name.localeCompare(scouter2.name);
    });
  }, [data]);

  if (isLoading) {
    return (
      <div className="bg-slate-900 border border-emerald-500/20 rounded-xl p-10 text-center text-emerald-500 animate-pulse font-bold uppercase tracking-widest">
        Loading Leaderboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-slate-900 border border-red-500/20 rounded-xl p-10 text-center text-slate-500 italic">
        Failed to load leaderboard for {competition}.
      </div>
    );
  }

  const INCREMENT = 1;
  const FIRST_PLACE_INDEX = 0;
  const SECOND_PLACE_INDEX = 1;
  const THIRD_PLACE_INDEX = 2;

  return (
    <div className="bg-slate-900 border border-emerald-500/20 rounded-xl overflow-hidden shadow-2xl">
      <div className="bg-emerald-500/10 p-4 border-b border-emerald-500/20">
        <h2 className="text-emerald-400 font-black tracking-tighter text-xl uppercase">
          scouter Leaderboard
        </h2>
      </div>

      <div className="p-2">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-slate-500 text-[10px] uppercase font-black tracking-widest">
              <th className="px-4 py-2">Rank</th>
              <th className="px-4 py-2">Scouter</th>
              <th className="px-4 py-2 text-right">Matches</th>
            </tr>
          </thead>
          <tbody>
            {sortedScouters.map((scouter, index) => {
              const customColor =
                scouterColor[scouter.name] || "text-slate-200";
              const isGold = index === FIRST_PLACE_INDEX;
              const isSilver = index === SECOND_PLACE_INDEX;
              const isBronze = index === THIRD_PLACE_INDEX;

              return (
                <tr
                  key={scouter.name}
                  className="group hover:bg-emerald-500/5 transition-colors"
                >
                  <td className="px-4 py-3 first:rounded-l-lg">
                    <span
                      className={`
                        flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all
                        ${isGold ? "bg-yellow-400 text-slate-950 shadow-[0_0_10px_#facc15]" : ""}
                        ${isSilver ? "bg-slate-300 text-slate-900 shadow-[0_0_8px_#cbd5e1]" : ""}
                        ${isBronze ? "bg-amber-600 text-slate-950 shadow-[0_0_8px_#d97706]" : ""}
                        ${!isGold && !isSilver && !isBronze ? "bg-slate-800 text-slate-400" : ""}
                      `}
                    >
                      {index + INCREMENT}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`font-bold transition-colors ${customColor}`}
                    >
                      {scouter.name}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right last:rounded-r-lg">
                    <span className="text-lg font-black text-white tabular-nums">
                      {scouter.scoutedMatches}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isEmpty(sortedScouters) && (
        <div className="p-10 text-center text-slate-500 font-medium italic">
          No scouter data available for this event.
        </div>
      )}
    </div>
  );
};
