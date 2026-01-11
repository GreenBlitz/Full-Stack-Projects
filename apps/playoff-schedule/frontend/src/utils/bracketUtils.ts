// בס"ד
import type { MatchesSimpleType } from "../endpoints/MatchSimple";
import type { NextMatches } from "./bracketTypes";
import { bracketStructure } from "./bracketConstants";
import { getBracketMatchNumber, findMatchByBracketNumber, findFinalsMatch } from "./bracketMatchFinder";
import { getOpponentInfo, formatOpponentLabel } from "./bracketOpponentDetection";
import { finalsBracketNumber } from "./bracketConstants";

export type { PotentialMatch, NextMatches } from "./bracketTypes";
export { getBracketMatchNumber } from "./bracketMatchFinder";

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

  if (bracketMapping.ifWin === "finals") {
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
      result.ifWin = {
        matchLabel: `Finals vs ( ${opponentLabel})`,
        matchKey: finalsMatch.key,
        match: finalsMatch,
        isPlaceholder: false,
        opponentAlliance: opponentInfo?.opponentAlliance,
        opponentTeams: opponentInfo?.opponentTeams,
        ourAlliance: opponentInfo?.ourAlliance ?? null,
      };
    } else {
      result.ifWin = {
        matchLabel: "Finals",
        isPlaceholder: true,
      };
    }
  } else if (bracketMapping.ifWin === "eliminated") {
    result.ifWin = {
      matchLabel: "Eliminated from Tournament",
      isPlaceholder: false,
    };
  } else {
    const nextMatch = findMatchByBracketNumber(
      bracketMapping.ifWin,
      allMatches
    );
    if (nextMatch) {
      const opponentInfo = getOpponentInfo({
        currentMatch,
        nextMatch,
        isRedAlliance,
        currentBracketNumber: bracketNumber,
        nextBracketNumber: bracketMapping.ifWin,
        allMatches,
      });
      const opponentLabel = opponentInfo
        ? formatOpponentLabel(opponentInfo.opponentTeams)
        : "TBD";
      result.ifWin = {
        matchLabel: `Match ${bracketMapping.ifWin} vs ( ${opponentLabel})`,
        matchKey: nextMatch.key,
        match: nextMatch,
        isPlaceholder: false,
        opponentAlliance: opponentInfo?.opponentAlliance,
        opponentTeams: opponentInfo?.opponentTeams,
        ourAlliance: opponentInfo?.ourAlliance ?? null,
      };
    } else {
      result.ifWin = {
        matchLabel: `Match ${bracketMapping.ifWin}`,
        isPlaceholder: true,
      };
    }
  }

  if (bracketMapping.ifLoss === "eliminated") {
    result.ifLoss = {
      matchLabel: "Eliminated from Tournament",
      isPlaceholder: false,
    };
  } else {
    const nextMatch = findMatchByBracketNumber(
      bracketMapping.ifLoss,
      allMatches
    );
    if (nextMatch) {
      const opponentInfo = getOpponentInfo({
        currentMatch,
        nextMatch,
        isRedAlliance,
        currentBracketNumber: bracketNumber,
        nextBracketNumber: bracketMapping.ifLoss,
        allMatches,
      });
      const opponentLabel = opponentInfo
        ? formatOpponentLabel(opponentInfo.opponentTeams)
        : "TBD";
      result.ifLoss = {
        matchLabel: `Match ${bracketMapping.ifLoss} vs ( ${opponentLabel})`,
        matchKey: nextMatch.key,
        match: nextMatch,
        isPlaceholder: false,
        opponentAlliance: opponentInfo?.opponentAlliance,
        opponentTeams: opponentInfo?.opponentTeams,
        ourAlliance: opponentInfo?.ourAlliance ?? null,
      };
    } else {
      result.ifLoss = {
        matchLabel: `Match ${bracketMapping.ifLoss}`,
        isPlaceholder: true,
      };
    }
  }

  return result;
}
