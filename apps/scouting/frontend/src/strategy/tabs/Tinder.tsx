//בס"ד
import type React from "react";
import { useEffect, useState } from "react";
import { fetchTeamNumbers } from "../fetches";
import type { TinderStats } from "@repo/scouting_types";
import { TeamCard } from "./TinderStatBox";

const FIRST_INDEX = 0;
const SECOND_INDEX = 1;
const INCREMENT = 1;

const tinderUrl = "/api/v1/tinder/";

const fetchTeamTinderStats = async (teamNumber: number) => {
  const params = new URLSearchParams({ teamNumber: teamNumber.toString() });
  const url = `${tinderUrl}?${params.toString()}`;

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
    return data.teamTinderStats as TinderStats;
  } catch (err) {
    console.error("Fetch failed:", err);
    throw err;
  }
};

const FULL_PERCENT = 100;

export const Tinder: React.FC = () => {
  const [teamOrder, setTeamOrder] = useState<number[]>([]);
  const [teamOneIndex, setTeamOneIndex] = useState<number>(FIRST_INDEX);
  const [teamTwoIndex, setTeamTwoIndex] = useState<number>(SECOND_INDEX);
  const [isSortComplete, setSortComlete] = useState<boolean>(true);
  const [statsOne, setStatsOne] = useState<TinderStats | null>(null);
  const [statsTwo, setStatsTwo] = useState<TinderStats | null>(null);

  useEffect(() => {
    fetchTeamNumbers().then(setTeamOrder).catch(console.error);
  }, []);

  useEffect(() => {
    if (!isSortComplete && teamOrder[teamOneIndex] && teamOrder[teamTwoIndex]) {
      fetchTeamTinderStats(teamOrder[teamOneIndex])
        .then(setStatsOne)
        .catch(console.error);
      fetchTeamTinderStats(teamOrder[teamTwoIndex])
        .then(setStatsTwo)
        .catch(console.error);
    }
  }, [teamOneIndex, teamTwoIndex, isSortComplete, teamOrder]);

  const resetSort = () => {
    setSortComlete(false);

    setTeamOneIndex(FIRST_INDEX);

    setTeamTwoIndex(SECOND_INDEX);
  };

  const handleChosen = (winnerIndex: number) => {
    const nextTeamIndex = teamTwoIndex + INCREMENT;
    if (winnerIndex === teamOneIndex) {
      const newOrder = [...teamOrder];
      [newOrder[teamOneIndex], newOrder[teamTwoIndex]] = [
        newOrder[teamTwoIndex],
        newOrder[teamOneIndex],
      ];
      setTeamOrder(newOrder);
    }
    setTeamOneIndex(teamTwoIndex);
    setTeamTwoIndex(nextTeamIndex);
    setSortComlete(nextTeamIndex >= teamOrder.length);
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-8">
      {isSortComplete ? (
        <div className="text-center">
          <h1 className="text-5xl font-black mb-8 italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">
            STRATEGY <span className="text-emerald-500">TINDER</span>
          </h1>

          <button
            onClick={() => {
              resetSort();
            }}
            className="px-12 py-4 bg-emerald-500 text-slate-950 font-black uppercase tracking-widest rounded-full hover:scale-110 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all active:scale-95"
          >
            Start Swiping
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-12 w-full max-w-7xl">
          <div className="flex flex-wrap justify-center gap-12 items-center">
            <TeamCard
              teamNumber={teamOrder[teamOneIndex]}
              stats={statsOne}
              opponentStats={statsTwo}
              onSelect={() => {
                handleChosen(teamOneIndex);
              }}
            />
            <div className="text-slate-700 font-black italic text-6xl select-none opacity-20">
              VS
            </div>
            <TeamCard
              teamNumber={teamOrder[teamTwoIndex]}
              stats={statsTwo}
              opponentStats={statsOne}
              onSelect={() => {
                handleChosen(teamTwoIndex);
              }}
            />
          </div>
          <div className="w-full max-w-md h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-emerald-500 transition-all duration-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
              style={{
                width: `${(teamTwoIndex / teamOrder.length) * FULL_PERCENT}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
