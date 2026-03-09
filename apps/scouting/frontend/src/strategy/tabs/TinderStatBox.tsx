// בס"ד
import type React from "react";
import type { TinderStats, TeleClimbLevel } from "@repo/scouting_types";

const DEFAULT_LEVEL = 0;
const levelToScore = (level: TeleClimbLevel) => {
  const map: Record<string, number> = { L0: 0, L1: 1, L2: 2, L3: 3 };
  return map[level] || DEFAULT_LEVEL;
};

const TinderStatBox: React.FC<{
  label: string;
  value: number | string;
  colorClass: string;
}> = ({ label, value, colorClass }) => (
  <div
    className={`p-6 border-b border-white/5 flex flex-col items-center justify-center text-center transition-all duration-300 ${colorClass}`}
  >
    <span className="text-[10px] uppercase tracking-[0.3em] font-bold mb-2 opacity-60">
      {label}
    </span>
    <span className="text-3xl font-black tabular-nums">{value}</span>
  </div>
);

export const TeamCard: React.FC<{
  teamNumber: number;
  stats: TinderStats | null;
  opponentStats: TinderStats | null;
  onSelect: () => void;
}> = ({ teamNumber, stats, opponentStats, onSelect }) => {
  if (!stats || !opponentStats) {
    return (
      <div className="w-96 h-[600px] bg-slate-900/40 animate-pulse rounded-[3rem] border border-white/10" />
    );
  }

  const getStatColor = (
    thisStat: number,
    otherStat: number,
    isHigherBetter = true,
  ) => {
    if (thisStat === otherStat) return "bg-slate-900/50 text-slate-400";
    const isWinner = isHigherBetter
      ? thisStat > otherStat
      : thisStat < otherStat;
    return isWinner
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : "bg-rose-500/5 text-rose-500/60 border-rose-500/10";
  };

  const DIGITS_AFTER_DECIMAL_DOT = 3;

  return (
    <div className="bg-slate-900/40 border border-white/10 rounded-[1rem] overflow-hidden shadow-2xl backdrop-blur-sm w-96 transition-all hover:scale-[1.02]">
      <div className="bg-slate-900 border-b border-white/10 py-12 flex flex-col items-center justify-center text-center">
        <span className="text-[10px] uppercase tracking-[0.5em] font-black text-emerald-500 mb-4">
          Team
        </span>
        <h1 className="text-8xl font-black italic tracking-tighter text-white leading-none">
          {teamNumber}
        </h1>
      </div>

      <TinderStatBox
        label="Tele Scored"
        value={stats.fuel.tele.scored.toFixed(DIGITS_AFTER_DECIMAL_DOT)}
        colorClass={getStatColor(
          stats.fuel.tele.scored,
          opponentStats.fuel.tele.scored,
        )}
      />

      <TinderStatBox
        label="Max Climb"
        value={stats.climb.maxClimbLevel}
        colorClass={getStatColor(
          levelToScore(stats.climb.maxClimbLevel),
          levelToScore(opponentStats.climb.maxClimbLevel),
        )}
      />

      <TinderStatBox
        label="Stuck on Bump"
        value={stats.movement.stuckOnBump}
        colorClass={getStatColor(
          stats.movement.stuckOnBump,
          opponentStats.movement.stuckOnBump,
          false,
        )}
      />

      <button
        onClick={onSelect}
        className="w-full py-8 bg-emerald-500 text-slate-950 font-black uppercase tracking-[0.3em] text-sm hover:bg-emerald-400 transition-all active:scale-95 shadow-[0_-10px_20px_rgba(16,185,129,0.1)]"
      >
        Select Team
      </button>
    </div>
  );
};
