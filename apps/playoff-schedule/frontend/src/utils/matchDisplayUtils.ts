// בס"ד
import type { MatchesSimpleType } from "../endpoints/MatchSimple";

export const getMatchDisplayName = (match: MatchesSimpleType): string => {
  const level = match.comp_level.toUpperCase();
  switch (level) {
    case "QM":
      return `Quals ${match.match_number}`;
    case "QF":
      return `Quarterfinal ${match.set_number}, Match ${match.match_number}`;
    case "SF":
      return `Semifinal ${match.set_number}, Match ${match.match_number}`;
    case "F":
      return `Finals Match ${match.match_number}`;
    case "EF":
      return `Octofinal ${match.set_number}, Match ${match.match_number}`;
    default:
      return `${level} ${match.match_number}`;
  }
};

export const formatMatchTime = (
  time: number | undefined,
  timeMultiplier: number
): string => {
  if (!time) return "TBD";
  return new Date(time * timeMultiplier).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};
