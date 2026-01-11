// בס"ד
import type { MatchesSimpleType } from "../endpoints/MatchSimple";
import { getMatchDisplayName } from "./matchDisplayUtils";

export interface PotentialMatch {
  matchLabel: string;
  matchKey?: string;
  match?: MatchesSimpleType;
  isPlaceholder: boolean;
}

export interface NextMatches {
  ifWin: PotentialMatch | null;
  ifLoss: PotentialMatch | null;
}

export function getPotentialNextMatches(
  currentMatch: MatchesSimpleType,
  _isRedAlliance: boolean,
  allMatches: MatchesSimpleType[]
): NextMatches {
  const result: NextMatches = {
    ifWin: null,
    ifLoss: null,
  };

  const playoffMatches = allMatches.filter(
    (m) => m.comp_level !== "qm" && m.comp_level !== "ef" && m.comp_level !== "qf"
  );

  const fMatches = playoffMatches
    .filter((m) => m.comp_level === "f")
    .sort((a, b) => a.match_number - b.match_number);

  if (currentMatch.comp_level === "sf") {
    if (fMatches.length > 0) {
      const nextFinals = fMatches[0];
      result.ifWin = {
        matchLabel: `Finals Match ${nextFinals.match_number}`,
        matchKey: nextFinals.key,
        match: nextFinals,
        isPlaceholder: false,
      };
    } else {
      result.ifWin = {
        matchLabel: "Finals",
        isPlaceholder: true,
      };
    }

    result.ifLoss = {
      matchLabel: `Lower Bracket (Loser of ${getMatchDisplayName(currentMatch)})`,
      isPlaceholder: true,
    };
  }

  if (currentMatch.comp_level === "f") {
    return result;
  }

  return result;
}
