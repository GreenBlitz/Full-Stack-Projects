// בס"ד

import type {
  AllianceTeams,
  SuperMetricKey,
  SuperRatingValue,
  SuperSection,
  TeamSuperScout,
} from "@repo/scouting_types";

export const SUPER_SCOUT_METRICS: readonly {
  key: SuperMetricKey;
  label: string;
}[] = [
  { key: "defense", label: "Defense" },
  { key: "evasion", label: "Defended On" },
  { key: "perception", label: "Game Perception" },
  { key: "trench", label: "Trench" },
  { key: "bump", label: "Bump" },
  { key: "collection", label: "Collection" },
  { key: "moveShoot", label: "Moving While Shooting" },
];

export const RATING_OPTIONS: SuperRatingValue[] = ["1", "2", "3", "4"];

export const SUPER_SCOUT_API_URL = "/api/v1/super";

export const formInputStyles =
  "w-full p-2.5 text-sm border border-white/10 rounded-xl bg-slate-800/40 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200";

export const ALLIANCE_SIZE = 3;

const EMPTY_SECTION: SuperSection = { rating: undefined, info: undefined };

const createEmptyTeamData = (): TeamSuperScout => ({
  defense: { ...EMPTY_SECTION },
  evasion: { ...EMPTY_SECTION },
  perception: { ...EMPTY_SECTION },
  trench: { ...EMPTY_SECTION },
  bump: { ...EMPTY_SECTION },
  collection: { ...EMPTY_SECTION },
  moveShoot: { ...EMPTY_SECTION },
  teamNumber: 0,
});

export const createEmptyAllianceTeams = (): AllianceTeams => [
  createEmptyTeamData(),
  createEmptyTeamData(),
  createEmptyTeamData(),
];
