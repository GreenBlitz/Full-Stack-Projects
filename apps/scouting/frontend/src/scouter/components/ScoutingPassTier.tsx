import { type ScoutingPassTier as ScoutingPassTierType } from "@repo/scouting_types";
import { TierCosmeticBadge } from "./TierCosmeticBadge";

type ScoutingPassTierProps = {
  tier: ScoutingPassTierType;
  active: boolean;
};

export const ScoutingPassTier: React.FC<ScoutingPassTierProps> = ({
  tier,
  active,
}) => {
  const Icon = tier.icon;
  return (
    <div
      className={`flex flex-col justify-center items-center text-center gap-2 p-2 min-h-50 rounded-lg ${
        active
          ? "bg-emerald-500/20 border border-emerald-500/50"
          : "bg-slate-800 border border-slate-600"
      }`}
    >
      {Icon && <Icon className="h-10 w-10" />}
      <p>XP: {tier.xp}</p>
      <p>Reward: {tier.reward}</p>
      {tier.cosmetic && (
        <div>
          <p className="text-slate-400 text-sm italic">Cosmetic:</p>
          <TierCosmeticBadge
            key={`tier-${tier.tier}-cosmetic`}
            tier={tier.tier}
            cosmetic={tier.cosmetic}
            size="md"
          />
        </div>
      )}
    </div>
  );
};
