// בס"ד
import type { Match } from "../rebuilt";
import type { TBAMatch } from "./TBAMatch";

const PLAYOFF_MATCHES_UNTIL_FINALS = 13;

export const tbaMatchToRegularMatch = (tbaMatch: TBAMatch): Match => {
  const matchNumber = tbaMatch.match_number;
  const setNumber = tbaMatch.set_number;
  const matchLevel = tbaMatch.comp_level;

  if (matchLevel === "pc") {
    return { number: matchNumber, type: "practice" };
  }
  if (matchLevel === "qm") {
    return { number: matchNumber, type: "qualification" };
  }

  if (matchLevel === "sf") {
    return { number: setNumber, type: "playoff" };
  }
  return {
    number: matchNumber + PLAYOFF_MATCHES_UNTIL_FINALS,
    type: "playoff",
  };
};

const MATCH_TYPES_ORDER: Record<Match["type"], number> = {
  practice: 0,
  qualification: 1,
  playoff: 2,
};

export const compareMatches = (match1: Match, match2: Match) => {
  const isTypeSame = match1.type === match2.type;

  if (!isTypeSame) {
    return MATCH_TYPES_ORDER[match1.type] - MATCH_TYPES_ORDER[match2.type];
  }
  return match1.number - match2.number;
};

const MATCH_SAME_COMPARANCE = 0;
export const isMatchesSame = (match1: Match, match2: Match) =>
  compareMatches(match1, match2) === MATCH_SAME_COMPARANCE;
