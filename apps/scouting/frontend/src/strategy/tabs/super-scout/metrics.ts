// בס"ד

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

// Ratings are strings (not numbers) because the backend's io-ts `t.keyof` codec
// validates against string keys at runtime.
export type RatingValue = "1" | "2" | "3" | "4";

export interface MetricSection {
  rating: RatingValue | undefined;
  info: string | undefined;
}

export type TeamMetricSections = Record<MetricKey, MetricSection>;

export type MatchType = "practice" | "qualification" | "playoff";

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
