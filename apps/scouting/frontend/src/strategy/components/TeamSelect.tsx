// בס"ד
import { FRC_TEAMS } from "@repo/frc";
import type { FC } from "react";
import { LuUsers } from "react-icons/lu";
import { LuHash } from "react-icons/lu";

interface TeamSelectProps {
  teamNumber?: number;
  setTeamNumber: (team: number) => void;
}

const EMPTY_TEAM_INPUT = 0;

export const TeamSelect: FC<TeamSelectProps> = ({
  teamNumber,
  setTeamNumber,
}) => (
  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto p-4 bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl">
    <div className="relative flex-1">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500/50">
        <LuHash size={16} />
      </div>
      <input
        onChange={(event) => {
          setTeamNumber(Number(event.currentTarget.value));
        }}
        value={teamNumber === EMPTY_TEAM_INPUT ? undefined : teamNumber}
        type="number"
        placeholder="Team #"
        className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-white/5 rounded-xl text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition-all font-mono"
      />
    </div>

    <div className="relative flex-2">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500/50 pointer-events-none">
        <LuUsers size={16} />
      </div>
      <select
        className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-white/5 rounded-xl text-slate-200 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition-all cursor-pointer font-bold text-sm"
        onChange={(event) => {
          setTeamNumber(Number(event.currentTarget.value));
        }}
        value={teamNumber}
      >
        <option disabled selected className="bg-slate-900 text-slate-500">
          Select Team
        </option>
        {FRC_TEAMS.map((team) => (
          <option
            key={team.teamNumber}
            value={team.teamNumber}
            className="bg-slate-900 text-slate-200"
          >
            {team.teamNumber} | {team.nickname}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1 1L5 5L9 1" />
        </svg>
      </div>
    </div>
  </div>
);
