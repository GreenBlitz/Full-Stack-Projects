// בס"ד
import type { Match } from "../rebuilt";
import type { TBAMatch } from "./TBAMatch";

const PLAYOFF_MATCHES_UNTIL_FINALS = 13;

/** Maps TBA `comp_level` / set / match numbers to app `Match` (quals, practice, playoffs). */
export const tbaScheduleFieldsToMatch = (
  comp_level: string,
  set_number: number,
  match_number: number,
): Match => {
  if (comp_level === "pc") {
    return { number: match_number, type: "practice" };
  }
  if (comp_level === "qm") {
    return { number: match_number, type: "qualification" };
  }

  if (comp_level === "sf") {
    return { number: set_number, type: "playoff" };
  }
  return {
    number: match_number + PLAYOFF_MATCHES_UNTIL_FINALS,
    type: "playoff",
  };
};

export const tbaMatchToRegularMatch = (tbaMatch: TBAMatch): Match =>
  tbaScheduleFieldsToMatch(
    tbaMatch.comp_level,
    tbaMatch.set_number,
    tbaMatch.match_number,
  );

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
