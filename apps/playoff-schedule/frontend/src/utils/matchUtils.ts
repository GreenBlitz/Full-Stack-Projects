// בס"ד
import type { MatchesSimpleType } from "../endpoints/MatchSimple";
import {
  matchTimeDefault,
  matchTimeMissing,
  sortABeforeB,
  sortBBeforeA,
  COMP_LEVEL_WEIGHTS,
} from "../config/frcConfig";

export const getMatchTime = (match: MatchesSimpleType): number =>
  match.predicted_time ?? match.time ?? matchTimeDefault;

const getLevelWeight = (level: string): number =>
  COMP_LEVEL_WEIGHTS[level] ?? COMP_LEVEL_WEIGHTS.default;

export const sortMatches = (
  a: MatchesSimpleType,
  b: MatchesSimpleType
): number => {
  const timeA = getMatchTime(a);
  const timeB = getMatchTime(b);
  const weightA = getLevelWeight(a.comp_level);
  const weightB = getLevelWeight(b.comp_level);

  if (timeA > matchTimeMissing && timeB > matchTimeMissing) {
    return timeA - timeB;
  }

  if (timeA === matchTimeMissing && timeB > matchTimeMissing) {
    return sortABeforeB;
  }

  if (timeA > matchTimeMissing && timeB === matchTimeMissing) {
    return sortBBeforeA;
  }

  if (weightA !== weightB) {
    return weightA - weightB;
  }

  return a.match_number - b.match_number;
};
