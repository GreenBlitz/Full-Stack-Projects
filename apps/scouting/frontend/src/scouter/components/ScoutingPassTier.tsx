import { type ScoutingPassTier as ScoutingPassTierProps } from "@repo/scouting_types";

export const ScoutingPassTier: React.FC<
  ScoutingPassTierProps & { active: boolean }
> = ({ xp, reward, icon, active }) => {
  const Icon = icon;
  return (
    <div
      className={`flex flex-col items-center text-center gap-1 p-2 rounded-lg ${
        active
          ? "bg-emerald-500/20 border border-emerald-500/50"
          : "bg-slate-800 border border-slate-600"
      }`}
    >
      {Icon && <Icon className="h-10 w-10" />}
      <p>XP: {xp}</p>
      <p>Reward: {reward}</p>
    </div>
  );
};
