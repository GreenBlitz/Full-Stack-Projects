//בס"ד
import type React from "react";
import { useEffect, useState } from "react";
import { fetchTeamNumbers } from "../fetches";
import type { TinderStats } from "@repo/scouting_types";

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

const StatBox: React.FC<{
  label: string;
  value: string | number;
  isBetter: boolean;
  isWorse: boolean;
}> = ({ label, value, isBetter, isWorse }) => (
  <div
    className={`p-3 rounded-xl border transition-all duration-500 ${
      isBetter
        ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
        : isWorse
          ? "bg-rose-500/10 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
          : "bg-slate-800/50 border-white/10"
    }`}
  >
    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-1">
      {label}
    </p>
    <p
      className={`text-xl font-mono font-bold ${isBetter ? "text-emerald-400" : isWorse ? "text-rose-400" : "text-white"}`}
    >
      {value}
    </p>
  </div>
);

export const TeamCard: React.FC<{
  teamNumber: number;
  stats: TinderStats | null;
  opponentStats: TinderStats | null;
  onSelect: () => void;
}> = ({ teamNumber, stats, opponentStats, onSelect }) => {
  if (!stats || !opponentStats)
    return (
      <div className="w-80 h-96 animate-pulse bg-slate-900 rounded-3xl border border-white/5" />
    );

  const isFuelBetter = stats.fuel.tele.scored > opponentStats.fuel.tele.scored;
  const isFuelWorse = stats.fuel.tele.scored < opponentStats.fuel.tele.scored;

  const isMovementBetter =
    stats.movement.stuckOnBump < opponentStats.movement.stuckOnBump;
  const isMovementWorse =
    stats.movement.stuckOnBump > opponentStats.movement.stuckOnBump;

  return (
    <button
      onClick={onSelect}
      className="group relative w-80 bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-white/10 hover:border-emerald-500/50 transition-all duration-300 hover:scale-[1.02] shadow-2xl text-left"
    >
      <h2 className="text-slate-400 font-black uppercase text-xs mb-6 tracking-[0.2em]">
        {teamNumber}
      </h2>

      <div className="flex flex-col gap-4">
        <StatBox
          label="Teleop Scored"
          value={stats.fuel.tele.scored}
          isBetter={isFuelBetter}
          isWorse={isFuelWorse}
        />
        <StatBox
          label="Max Climb"
          value={stats.climb.maxClimbLevel}
          isBetter={false}
          isWorse={false}
        />
        <StatBox
          label="Stuck on Bump"
          value={stats.movement.stuckOnBump}
          isBetter={isMovementBetter}
          isWorse={isMovementWorse}
        />
      </div>

      <div className="mt-8 w-full py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center rounded-xl font-black uppercase text-[10px] tracking-widest group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
        Choose Team
      </div>
    </button>
  );
};

export const Tinder: React.FC = () => {
  const [teamOrder, setTeamOrder] = useState<number[]>([]);
  const [indexOne, setIndexOne] = useState<number>(FIRST_INDEX);
  const [indexTwo, setIndexTwo] = useState<number>(SECOND_INDEX);
  const [isSortComplete, setSortComlete] = useState<boolean>(true);

  const [statsOne, setStatsOne] = useState<TinderStats | null>(null);
  const [statsTwo, setStatsTwo] = useState<TinderStats | null>(null);

  useEffect(() => {
    fetchTeamNumbers().then(setTeamOrder).catch(console.error);
  }, []);

  useEffect(() => {
    if (!isSortComplete && teamOrder[indexOne] && teamOrder[indexTwo]) {
      fetchTeamTinderStats(teamOrder[indexOne])
        .then(setStatsOne)
        .catch(console.error);
      fetchTeamTinderStats(teamOrder[indexTwo])
        .then(setStatsTwo)
        .catch(console.error);
    }
  }, [indexOne, indexTwo, isSortComplete, teamOrder]);

  const resetSort = () => {
    setSortComlete(false);
    setIndexOne(FIRST_INDEX);
    setIndexTwo(SECOND_INDEX);
  };

  const handleChosen = (winnerIndex: number) => {
    const nextTeamIndex = indexTwo + INCREMENT;
    if (winnerIndex === indexOne) {
      const newOrder = [...teamOrder];
      [newOrder[indexOne], newOrder[indexTwo]] = [
        newOrder[indexTwo],
        newOrder[indexOne],
      ];
      setTeamOrder(newOrder);
    }
    setIndexOne(indexTwo);
    setIndexTwo(nextTeamIndex);
    setSortComlete(nextTeamIndex >= teamOrder.length);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-900 via-black to-black">
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
        <div className="flex flex-col items-center gap-12 w-full max-w-5xl">
          <div className="flex flex-wrap justify-center gap-8 items-center">
            <TeamCard
              teamNumber={teamOrder[indexOne]}
              stats={statsOne}
              opponentStats={statsTwo}
              onSelect={() => {
                handleChosen(indexOne);
              }}
            />

            <div className="text-slate-700 font-black italic text-4xl select-none">
              VS
            </div>

            <TeamCard
              teamNumber={teamOrder[indexTwo]}
              stats={statsTwo}
              opponentStats={statsOne}
              onSelect={() => {
                handleChosen(indexTwo);
              }}
            />
          </div>

          <div className="w-full max-w-md h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{
                width: `${(indexTwo / teamOrder.length) * FULL_PERCENT}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
