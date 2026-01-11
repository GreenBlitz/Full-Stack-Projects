// בס"ד
import type { MatchesSimpleType } from "../endpoints/MatchSimple";
import {
  minBracketMatch,
  maxBracketMatch,
  firstMatchNumber,
  emptyArrayLength,
  firstArrayIndex,
} from "./bracketConstants";

export function getBracketMatchNumber(match: MatchesSimpleType): number | null {
  if (match.comp_level === "f") {
    return null;
  }

  if (match.comp_level === "sf") {
    if (
      match.set_number >= minBracketMatch &&
      match.set_number <= maxBracketMatch
    ) {
      return match.set_number;
    }
  }

  return null;
}

export function findMatchByBracketNumber(
  bracketNumber: number,
  allMatches: MatchesSimpleType[]
): MatchesSimpleType | null {
  const playoffMatches = allMatches.filter(
    (m) =>
      m.comp_level !== "qm" && m.comp_level !== "ef" && m.comp_level !== "qf"
  );

  if (bracketNumber >= minBracketMatch && bracketNumber <= maxBracketMatch) {
    const sfMatch = playoffMatches.find(
      (m) =>
        m.comp_level === "sf" &&
        m.set_number === bracketNumber &&
        m.match_number === firstMatchNumber
    );
    if (sfMatch) {
      return sfMatch;
    }

    const anySfMatch = playoffMatches.find(
      (m) => m.comp_level === "sf" && m.set_number === bracketNumber
    );
    if (anySfMatch) {
      return anySfMatch;
    }
  }

  return null;
}

export function findFinalsMatch(
  allMatches: MatchesSimpleType[]
): MatchesSimpleType | null {
  const playoffMatches = allMatches.filter(
    (m) =>
      m.comp_level !== "qm" && m.comp_level !== "ef" && m.comp_level !== "qf"
  );
  const fMatches = playoffMatches
    .filter((m) => m.comp_level === "f")
    .sort((a, b) => a.match_number - b.match_number);
  return fMatches.length > emptyArrayLength ? fMatches[firstArrayIndex] : null;
}
