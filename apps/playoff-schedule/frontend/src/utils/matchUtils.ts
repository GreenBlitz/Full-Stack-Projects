// בס"ד
import type { MatchesSimpleType } from "../endpoints/MatchSimple";
import {
  matchTimeDefault,
  matchTimeMissing,
  sortABeforeB,
  sortBBeforeA,
  weightQm,
  weightEf,
  weightQf,
  weightSf,
  weightF,
  weightDefault,
} from "../config/frcConfig";

export const getMatchTime = (match: MatchesSimpleType): number =>
  match.predicted_time ?? match.time ?? matchTimeDefault;

const getLevelWeight = (level: string): number => 
  level === 'qm' ? weightQm
  : level === 'ef' ? weightEf
  : level === 'qf' ? weightQf
  : level === 'sf' ? weightSf
  : level === 'f' ? weightF
  : weightDefault;
  
export const sortMatches = (a: MatchesSimpleType, b: MatchesSimpleType) => {
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
