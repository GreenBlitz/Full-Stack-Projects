import { FaTrophy as Trophy, FaSeedling as Seedling } from "react-icons/fa";
import { MdLibraryMusic as Music } from "react-icons/md";
import { GiHighFive as HighFive } from "react-icons/gi";
import { LuCandy as Candy } from "react-icons/lu";

export interface ScoutingPassLevel {
  xp: number;
  level: number;
  title?: string;
  color: string;
}

export type TierCosmetic = {
  text?: string;
  icon?: React.ComponentType<{ className?: string }>;
  label?: string;
  color?: string;
};

export interface ScoutingPassTier {
  tier: number;
  xp: number;
  reward: string;
  icon?: React.ComponentType<{ className?: string }>;
  cosmetic?: TierCosmetic;
}

export const getUnlockedTiers = (xp: number): ScoutingPassTier[] =>
  SCOUTING_PASS_TIERS.filter((tier) => tier.xp <= xp);

export const getUnlockedTitle = (xp: number): string =>
  SCOUTING_PASS_LEVELS.reduce(
    (title, level) => (level.xp <= xp && level.title ? level.title : title),
    "",
  );

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
    reward: "TBD",
  },
  {
    tier: 2,
    xp: 10,
    reward: "Sweet Treat! You get a piece of candy",
    icon: Candy,
  },
  {
    tier: 3,
    xp: 15,
    reward: "Acknowledgement badge",
    cosmetic: {
      label: "Seedling Badge",
      icon: Seedling,
      color: "teal-400",
    },
  },
  {
    tier: 4,
    xp: 25,
    reward: "High Five from the captains",
    icon: HighFive,
  },
  {
    tier: 5,
    xp: 30,
    reward: "TBD",
  },
  {
    tier: 6,
    xp: 40,
    reward: "TBD",
  },
  {
    tier: 7,
    xp: 50,
    reward: "Public display of Excellence",
    cosmetic: {
      text: "Excellence",
      icon: Trophy,
      color: "amber-400",
      label: "Excellence Badge",
    },
  },
  {
    tier: 8,
    xp: 60,
    reward: "Music privileges for the bus",
    icon: Music,
  },
];
