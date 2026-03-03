// בס"ד

import type { Match, SuperRating, SuperSection } from "@repo/scouting_types";

export const SUPER_SCOUT_METRICS = [
  { key: "defense", label: "Defense" },
  { key: "evasion", label: "Defended On" },
  { key: "perception", label: "Game Perception" },
  { key: "trench", label: "Trench" },
  { key: "bump", label: "Bump" },
  { key: "collection", label: "Collection" },
  { key: "moveShoot", label: "Moving While Shooting" },
] as const;

export type MetricKey = (typeof SUPER_SCOUT_METRICS)[number]["key"];

export type RatingValue = Exclude<SuperRating, undefined>;

export type TeamMetricSections = Record<MetricKey, SuperSection>;

export type MatchType = Match["type"];

export const RATING_OPTIONS: RatingValue[] = ["1", "2", "3", "4"];

export const SUPER_SCOUT_API_URL = "/api/v1/super";

export const formInputStyles = `w-full p-2.5 text-sm border border-white/10 rounded-xl 
  bg-slate-800/40 text-slate-200
  focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50
  transition-all duration-200`;

export const createEmptyMetricSections = (): TeamMetricSections =>
  Object.fromEntries(
    SUPER_SCOUT_METRICS.map(({ key }) => [
      key,
      { rating: undefined, info: undefined },
    ]),
  ) as TeamMetricSections;

export interface TeamSuperScoutData extends TeamMetricSections {
  teamNumber: number;
}

export type AllianceTeams = [
  TeamSuperScoutData,
  TeamSuperScoutData,
  TeamSuperScoutData,
];

export const ALLIANCE_SIZE = 3;

export const TEAM_POSITIONS = ["Team 1", "Team 2", "Team 3"] as const;

export const createEmptyTeamData = (): TeamSuperScoutData => ({
  ...createEmptyMetricSections(),
  teamNumber: 0,
});

export const createEmptyAllianceTeams = (): AllianceTeams => [
  createEmptyTeamData(),
  createEmptyTeamData(),
  createEmptyTeamData(),
];
