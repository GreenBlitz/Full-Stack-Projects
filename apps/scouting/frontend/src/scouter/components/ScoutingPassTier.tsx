import { type ScoutingPassTier as ScoutingPassTierProps } from "@repo/scouting_types";

export const ScoutingPassTier: React.FC<
  ScoutingPassTierProps & { active: boolean }
> = ({ tier, xp, reward, active }) => {
  return (
    <div
      className={
        active
          ? "bg-emerald-500/20 border border-emerald-500/50"
          : "bg-slate-800 border border-slate-600"
      }
    >
      <h3>Tier {tier}</h3>
      <p>XP: {xp}</p>
      <p>Reward: {reward}</p>
    </div>
  );
};
