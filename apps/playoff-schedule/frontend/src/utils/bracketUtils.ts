// בס"ד
import type { MatchesSimpleType } from "../endpoints/MatchSimple";
import { bracketStructure } from "./bracketConstants";
import {
  getBracketMatchNumber,
  findMatchByBracketNumber,
  findFinalsMatch,
} from "./bracketMatchFinder";
import {
  getOpponentInfo,
  formatOpponentLabel,
} from "./bracketOpponentDetection";
import { finalsBracketNumber } from "./bracketConstants";

import type { PotentialMatch, NextMatches } from "./bracketTypes";
export type { PotentialMatch, NextMatches };
export { getBracketMatchNumber } from "./bracketMatchFinder";

interface NextMatchScenarioOptions {
  target: number | "finals" | "eliminated";
  currentMatch: MatchesSimpleType;
  isRedAlliance: boolean;
  bracketNumber: number;
  allMatches: MatchesSimpleType[];
}

const getNextMatchScenario = ({
  target,
  currentMatch,
  isRedAlliance,
  bracketNumber,
  allMatches,
}: NextMatchScenarioOptions): PotentialMatch | null => {
  if (target === "eliminated") {
    return {
      matchLabel: "Eliminated from Tournament",
      isPlaceholder: false,
    };
  }

  if (target === "finals") {
    const finalsMatch = findFinalsMatch(allMatches);
    if (finalsMatch) {
      const opponentInfo = getOpponentInfo({
        currentMatch,
        nextMatch: finalsMatch,
        isRedAlliance,
        currentBracketNumber: bracketNumber,
        nextBracketNumber: finalsBracketNumber,
        allMatches,
      });
      const opponentLabel = opponentInfo
        ? formatOpponentLabel(opponentInfo.opponentTeams)
        : "TBD";
      return {
        matchLabel: `Finals vs ( ${opponentLabel})`,
        matchKey: finalsMatch.key,
        match: finalsMatch,
        isPlaceholder: false,
        opponentAllianceColor: opponentInfo?.opponentAlliance,
        opponentTeams: opponentInfo?.opponentTeams,
        ourAlliance: opponentInfo?.ourAlliance ?? null,
      };
    } else {
      return {
        matchLabel: "Finals",
        isPlaceholder: true,
      };
    }
  }

  const nextMatch = findMatchByBracketNumber(target, allMatches);
  if (nextMatch) {
    const opponentInfo = getOpponentInfo({
      currentMatch,
      nextMatch,
      isRedAlliance,
      currentBracketNumber: bracketNumber,
      nextBracketNumber: target,
      allMatches,
    });
    const opponentLabel = opponentInfo
      ? formatOpponentLabel(opponentInfo.opponentTeams)
      : "TBD";
    return {
      matchLabel: `Match ${target} vs ( ${opponentLabel})`,
      matchKey: nextMatch.key,
      match: nextMatch,
      isPlaceholder: false,
      opponentAllianceColor: opponentInfo?.opponentAlliance,
      opponentTeams: opponentInfo?.opponentTeams,
      ourAlliance: opponentInfo?.ourAlliance ?? null,
    };
  } else {
    return {
      matchLabel: `Match ${target}`,
      isPlaceholder: true,
    };
  }
};

export function getPotentialNextMatches(
  currentMatch: MatchesSimpleType,
  isRedAlliance: boolean,
  allMatches: MatchesSimpleType[]
): NextMatches {
  const result: NextMatches = {
    ifWin: null,
    ifLoss: null,
  };

  if (currentMatch.comp_level === "f") {
    result.ifWin = {
      matchLabel: "Winner takes the Blue Banner",
      isPlaceholder: false,
    };
    return result;
  }

  const bracketNumber = getBracketMatchNumber(currentMatch);
  if (bracketNumber === null) {
    return result;
  }

  const bracketMapping = bracketStructure[bracketNumber];

  if (bracketMapping.ifWin) {
    result.ifWin = getNextMatchScenario({
      target: bracketMapping.ifWin,
      currentMatch,
      isRedAlliance,
      bracketNumber,
      allMatches,
    });
  }

  if (bracketMapping.ifLoss) {
    result.ifLoss = getNextMatchScenario({
      target: bracketMapping.ifLoss,
      currentMatch,
      isRedAlliance,
      bracketNumber,
      allMatches,
    });
  }

  return result;
}
