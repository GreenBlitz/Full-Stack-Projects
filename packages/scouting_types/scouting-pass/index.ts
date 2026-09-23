export interface ScoutingPassLevel {
  xp: number;
  level: number;
  title?: string;
  color: string;
}

export interface ScoutingPassTier {
  tier: number;
  xp: number;
  reward: string;
}

export const SCOUTING_PASS_LEVELS: ScoutingPassLevel[] = [
  {
    xp: 0,
    level: 0,
    title: "Starter Scout",
    color: "slate-400",
  },
  {
    xp: 5,
    level: 1,
    title: "Novice Scout",
    color: "gray-400",
  },
  {
    xp: 10,
    level: 2,
    color: "zinc-400",
  },
  {
    xp: 15,
    level: 3,
    title: "Intermediate Scout",
    color: "emerald-500",
  },
  {
    xp: 20,
    level: 4,
    color: "teal-500",
  },
  {
    xp: 25,
    level: 5,
    title: "Experienced Scout",
    color: "cyan-500",
  },
  {
    xp: 30,
    level: 6,
    color: "sky-500",
  },
  {
    xp: 35,
    level: 7,
    color: "blue-500",
  },
  {
    xp: 40,
    level: 8,
    title: "Expert Scout",
    color: "indigo-500",
  },
  {
    xp: 45,
    level: 9,
    color: "violet-500",
  },
  {
    xp: 50,
    level: 10,
    title: "Data Analyst",
    color: "purple-500",
  },
  {
    xp: 60,
    level: 11,
    title: "Scouting Specialist",
    color: "fuchsia-500",
  },
  {
    xp: 70,
    level: 12,
    title: "Master Scouter",
    color: "amber-400",
  },
];

export const SCOUTING_PASS_TIERS: ScoutingPassTier[] = [
  {
    tier: 1,
    xp: 5,
    reward: "tier 1 reward",
  },
  {
    tier: 2,
    xp: 10,
    reward: "tier 2 reward",
  },
  {
    tier: 3,
    xp: 15,
    reward: "tier 3 reward",
  },
  {
    tier: 4,
    xp: 25,
    reward: "tier 4 reward",
  },
  {
    tier: 5,
    xp: 30,
    reward: "tier 5 reward",
  },
  {
    tier: 6,
    xp: 40,
    reward: "tier 6 reward",
  },
  {
    tier: 7,
    xp: 50,
    reward: "tier 7 reward",
  },
  {
    tier: 8,
    xp: 60,
    reward: "tier 8 reward",
  },
];
