// בס"ד
import type { MatchesSimpleType } from "../endpoints/MatchSimple";

const MATCH_DISPLAY_FORMATS: Record<
  string,
  ((match: MatchesSimpleType) => string) | undefined
> = {
  QM: (match) => `Quals ${match.match_number}`,
  QF: (match) =>
    `Quarterfinal ${match.set_number}, Match ${match.match_number}`,
  SF: (match) => `Semifinal ${match.set_number}, Match ${match.match_number}`,
  F: (match) => `Finals Match ${match.match_number}`,
  EF: (match) => `First Round ${match.set_number}, Match ${match.match_number}`,
};

export const getMatchDisplayName = (match: MatchesSimpleType): string => {
  const level = match.comp_level.toUpperCase();
  const formatFn = MATCH_DISPLAY_FORMATS[level];

  return formatFn ? formatFn(match) : `${level} ${match.match_number}`;
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
