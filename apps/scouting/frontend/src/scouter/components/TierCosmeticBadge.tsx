import type React from "react";
import type { TierCosmetic } from "@repo/scouting_types";

export interface TierCosmeticBadgeProps {
  cosmetic: TierCosmetic;
  tier: number;
  size?: "sm" | "md" | "lg";
}

export const TierCosmeticBadge: React.FC<TierCosmeticBadgeProps> = ({
  cosmetic,
  tier,
  size = "sm",
}) => {
  const tooltip = `Tier ${tier} cosmetic`;

  const iconSizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-10 h-10",
  }[size];

  const badgeSizeClasses = {
    sm: "min-h-5 min-w-5 px-1 text-[10px]",
    md: "min-h-7 min-w-7 px-1.5 text-xs",
    lg: "min-h-11 min-w-11 px-2 text-base",
  }[size];
  const Icon = cosmetic.icon;
  const accessibleLabel = cosmetic.label
    ? `${tooltip}: ${cosmetic.label}`
    : `${tooltip}${cosmetic.text ? `: ${cosmetic.text}` : ""}`;

  if (!Icon && !cosmetic.text) return null;

  const colorClass = cosmetic.color
    ? `text-${cosmetic.color}`
    : "text-slate-400";

  return (
    <span
      role="img"
      aria-label={accessibleLabel}
      title={accessibleLabel}
      style={{
        borderColor: "color-mix(in srgb, currentColor 30%, transparent)",
        backgroundColor: "color-mix(in srgb, currentColor 10%, transparent)",
      }}
      className={`inline-flex items-center justify-center rounded-full border font-semibold uppercase ${colorClass} ${badgeSizeClasses}`}
    >
      {Icon && <Icon className={iconSizeClasses} />}
      {cosmetic.text && <span>{cosmetic.text}</span>}
    </span>
  );
};
