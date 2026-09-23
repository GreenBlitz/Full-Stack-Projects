import type React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  SCOUTING_PASS_LEVELS,
  SCOUTING_PASS_TIERS,
  type Competition,
  type CompetitionLeaderboard,
  type Scouter,
  type ScoutingPassLevel,
} from "@repo/scouting_types";
import { isEmpty } from "@repo/array-functions";
import { fetchCompetitionData } from "./Leaderboard";
import { ScoutingPassTier } from "../components/ScoutingPassTier";

interface ScoutingPassProps {
  competition: Competition;
}

export const ScoutingPass: React.FC<ScoutingPassProps> = ({ competition }) => {
  const [data, setData] = useState<CompetitionLeaderboard | null>(null);
  const [scouter, setScouter] = useState<Scouter | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const scouterLevel = useMemo(
    () =>
      SCOUTING_PASS_LEVELS.reduce<ScoutingPassLevel | undefined>(
        (current, level) =>
          level.xp <= (scouter?.scoutedMatches ?? 0) ? level : current,
        undefined,
      ) || SCOUTING_PASS_LEVELS[0],
    [scouter?.scoutedMatches],
  );

  useEffect(() => {
    setLoading(true);
    fetchCompetitionData()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [competition]);

  const sortedScouters = useMemo(() => {
    // sort by name alphabetically
    if (!data?.scouters) return [];
    return [...data.scouters].sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  if (isLoading) {
    return (
      <div className="bg-slate-900 border border-emerald-500/20 rounded-xl p-10 text-center text-emerald-500 animate-pulse font-bold uppercase tracking-widest">
        Loading scouting data...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-slate-900 border border-red-500/20 rounded-xl p-10 text-center text-slate-500 italic">
        Failed to load scouting data for {competition}.
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-emerald-500/20 rounded-xl overflow-hidden shadow-2xl">
      <div className="bg-emerald-500/10 p-4 border-b border-emerald-500/20">
        <h2 className="text-emerald-400 font-black tracking-tighter text-xl uppercase">
          Scouting Pass for {competition}
        </h2>
      </div>
      <div className="p-4 flex items-center justify-center">
        <p className="text-slate-500 italic">
          Select a scouter to view their scouting pass:
        </p>
        <select
          className="ml-2 py-2 px-2 bg-slate-950/50 border border-white/5 rounded-xl text-slate-200 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition-all cursor-pointer font-bold text-sm text-center"
          onChange={(e) => {
            const selectedScouter =
              sortedScouters.find(
                (scouter) => scouter.name === e.target.value,
              ) || null;
            setScouter(selectedScouter);
          }}
        >
          <option
            disabled
            value="none"
            selected
            className="bg-slate-900 text-slate-500"
          >
            {isEmpty(sortedScouters)
              ? "No scouters available"
              : "Select a scouter"}
          </option>
          {sortedScouters.map((scouter) => (
            <option key={scouter.name} value={scouter.name}>
              {scouter.name}
            </option>
          ))}
        </select>
      </div>
      {scouter && (
        <div className="p-4 w-1/2 mx-auto flex flex-col items-center justify-center gap-4 bg-slate-800 rounded-2xl shadow-lg shadow-black/20">
          <h3 className="font-bold text-lg">{scouter.name}'s Scouting Pass</h3>
          <div className="flex flex-row items-center gap-2">
            <span
              className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all bg-${scouterLevel.color} text-slate-950`}
            >
              {scouterLevel.level}
            </span>
            <span className="text-slate-400 text-sm italic">
              {scouterLevel.title}
            </span>
          </div>
          <div className="flex flex-row gap-2">
            {SCOUTING_PASS_TIERS.map((tier) => (
              <ScoutingPassTier
                {...tier}
                active={tier.xp <= scouter.scoutedMatches}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
