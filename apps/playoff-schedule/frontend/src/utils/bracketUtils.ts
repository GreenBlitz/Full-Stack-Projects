// בס"ד
import type { MatchesSimpleType } from "../endpoints/MatchSimple";

export interface PotentialMatch {
  matchLabel: string;
  matchKey?: string;
  match?: MatchesSimpleType;
  isPlaceholder: boolean;
  opponentAlliance?: "red" | "blue";
  opponentTeams?: string[];
  ourAlliance?: "red" | "blue" | null;
}

export interface NextMatches {
  ifWin: PotentialMatch | null;
  ifLoss: PotentialMatch | null;
}

interface BracketMapping {
  ifWin: number | "finals" | "eliminated";
  ifLoss: number | "eliminated";
}

const bracketStructure: Record<number, BracketMapping> = {
  1: { ifWin: 7, ifLoss: 5 },
  2: { ifWin: 7, ifLoss: 5 },
  3: { ifWin: 8, ifLoss: 6 },
  4: { ifWin: 8, ifLoss: 6 },
  5: { ifWin: 10, ifLoss: "eliminated" },
  6: { ifWin: 9, ifLoss: "eliminated" },
  7: { ifWin: 11, ifLoss: 9 },
  8: { ifWin: 11, ifLoss: 10 },
  9: { ifWin: 12, ifLoss: "eliminated" },
  10: { ifWin: 12, ifLoss: "eliminated" },
  11: { ifWin: "finals", ifLoss: 13 },
  12: { ifWin: 13, ifLoss: "eliminated" },
  13: { ifWin: "finals", ifLoss: "eliminated" },
};

const minBracketMatch = 1;
const maxBracketMatch = 13;
const firstMatchNumber = 1;
const emptyArrayLength = 0;
const finalsBracketNumber = 0;
const firstArrayIndex = 0;

const match1 = 1;
const match2 = 2;
const match3 = 3;
const match4 = 4;
const match5 = 5;
const match6 = 6;
const match7 = 7;
const match8 = 8;
const match9 = 9;
const match10 = 10;
const match11 = 11;
const match12 = 12;
const match13 = 13;

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

function findMatchByBracketNumber(
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

function findFinalsMatch(
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

function getFeedingMatches(targetMatchNumber: number): {
  winFrom?: number[];
  lossFrom?: number[];
} {
  if (targetMatchNumber === match7) {
    return { winFrom: [match1, match2] };
  }
  if (targetMatchNumber === match8) {
    return { winFrom: [match3, match4] };
  }
  if (targetMatchNumber === match5) {
    return { lossFrom: [match1, match2] };
  }
  if (targetMatchNumber === match6) {
    return { lossFrom: [match3, match4] };
  }
  if (targetMatchNumber === match9) {
    return { winFrom: [match6], lossFrom: [match7] };
  }
  if (targetMatchNumber === match10) {
    return { winFrom: [match5], lossFrom: [match8] };
  }
  if (targetMatchNumber === match11) {
    return { winFrom: [match7, match8] };
  }
  if (targetMatchNumber === match12) {
    return { winFrom: [match9, match10] };
  }
  if (targetMatchNumber === match13) {
    return { winFrom: [match12], lossFrom: [match11] };
  }
  return {};
}

function getTeamsFromFeedingMatch(
  feedingMatchNumber: number,
  allMatches: MatchesSimpleType[],
  isWin: boolean
): { teams: string[]; alliance: "red" | "blue" | null } {
  const feedingMatch = findMatchByBracketNumber(feedingMatchNumber, allMatches);
  if (!feedingMatch) {
    return { teams: [], alliance: null };
  }

  if (feedingMatch.winning_alliance) {
    if (isWin) {
      const alliance = feedingMatch.winning_alliance === "red" ? "red" : "blue";
      return {
        teams:
          alliance === "red"
            ? feedingMatch.alliances.red.team_keys
            : feedingMatch.alliances.blue.team_keys,
        alliance,
      };
    } else {
      const alliance = feedingMatch.winning_alliance === "red" ? "blue" : "red";
      return {
        teams:
          alliance === "red"
            ? feedingMatch.alliances.red.team_keys
            : feedingMatch.alliances.blue.team_keys,
        alliance,
      };
    }
  }

  return { teams: [], alliance: null };
}

interface OpponentInfoOptions {
  currentMatch: MatchesSimpleType;
  nextMatch: MatchesSimpleType | null;
  isRedAlliance: boolean;
  currentBracketNumber: number;
  nextBracketNumber: number;
  allMatches: MatchesSimpleType[];
}

function getOpponentInfo(
  options: OpponentInfoOptions
): {
  opponentAlliance: "red" | "blue";
  opponentTeams: string[];
  ourAlliance: "red" | "blue" | null;
} | null {
  const {
    currentMatch,
    nextMatch,
    isRedAlliance,
    currentBracketNumber,
    nextBracketNumber,
    allMatches,
  } = options;

  if (!nextMatch) {
    return null;
  }

  const currentTeamKeys = isRedAlliance
    ? currentMatch.alliances.red.team_keys
    : currentMatch.alliances.blue.team_keys;

  const nextMatchRed = nextMatch.alliances.red.team_keys;
  const nextMatchBlue = nextMatch.alliances.blue.team_keys;

  const isRedInNext = currentTeamKeys.some((team) =>
    nextMatchRed.includes(team)
  );
  const isBlueInNext = currentTeamKeys.some((team) =>
    nextMatchBlue.includes(team)
  );

  if (isRedInNext) {
    return {
      opponentAlliance: "blue",
      opponentTeams: nextMatchBlue,
      ourAlliance: "red",
    };
  }

  if (isBlueInNext) {
    return {
      opponentAlliance: "red",
      opponentTeams: nextMatchRed,
      ourAlliance: "blue",
    };
  }

  if (nextBracketNumber > finalsBracketNumber) {
    const feedingMatches = getFeedingMatches(nextBracketNumber);
    const possibleOpponents: {
      teams: string[];
      alliance: "red" | "blue";
    }[] = [];

    if (feedingMatches.winFrom) {
      for (const feedMatchNum of feedingMatches.winFrom) {
        if (feedMatchNum !== currentBracketNumber) {
          const feedingMatch = findMatchByBracketNumber(
            feedMatchNum,
            allMatches
          );
          if (feedingMatch) {
            if (feedingMatch.winning_alliance) {
              const { teams, alliance } = getTeamsFromFeedingMatch(
                feedMatchNum,
                allMatches,
                true
              );
              if (teams.length > emptyArrayLength && alliance) {
                const filtered = teams.filter(
                  (team) => !currentTeamKeys.includes(team)
                );
                if (filtered.length > emptyArrayLength) {
                  possibleOpponents.push({ teams: filtered, alliance });
                }
              }
            } else {
              const redTeams = feedingMatch.alliances.red.team_keys.filter(
                (team) => !currentTeamKeys.includes(team)
              );
              const blueTeams = feedingMatch.alliances.blue.team_keys.filter(
                (team) => !currentTeamKeys.includes(team)
              );
              if (redTeams.length > emptyArrayLength) {
                possibleOpponents.push({ teams: redTeams, alliance: "red" });
              }
              if (blueTeams.length > emptyArrayLength) {
                possibleOpponents.push({ teams: blueTeams, alliance: "blue" });
              }
            }
          }
        }
      }
    }

    if (feedingMatches.lossFrom) {
      for (const feedMatchNum of feedingMatches.lossFrom) {
        if (feedMatchNum !== currentBracketNumber) {
          const feedingMatch = findMatchByBracketNumber(
            feedMatchNum,
            allMatches
          );
          if (feedingMatch) {
            if (feedingMatch.winning_alliance) {
              const { teams, alliance } = getTeamsFromFeedingMatch(
                feedMatchNum,
                allMatches,
                false
              );
              if (teams.length > emptyArrayLength && alliance) {
                const filtered = teams.filter(
                  (team) => !currentTeamKeys.includes(team)
                );
                if (filtered.length > emptyArrayLength) {
                  possibleOpponents.push({ teams: filtered, alliance });
                }
              }
            } else {
              const redTeams = feedingMatch.alliances.red.team_keys.filter(
                (team) => !currentTeamKeys.includes(team)
              );
              const blueTeams = feedingMatch.alliances.blue.team_keys.filter(
                (team) => !currentTeamKeys.includes(team)
              );
              if (redTeams.length > emptyArrayLength) {
                possibleOpponents.push({ teams: redTeams, alliance: "red" });
              }
              if (blueTeams.length > emptyArrayLength) {
                possibleOpponents.push({ teams: blueTeams, alliance: "blue" });
              }
            }
          }
        }
      }
    }

    if (possibleOpponents.length === firstMatchNumber) {
      const opponent = possibleOpponents[firstArrayIndex];
      return {
        opponentAlliance: opponent.alliance,
        opponentTeams: opponent.teams,
        ourAlliance: opponent.alliance === "red" ? "blue" : "red",
      };
    }
    if (possibleOpponents.length > firstMatchNumber) {
      const allTeams = possibleOpponents.flatMap((p) => p.teams);
      return {
        opponentAlliance: isRedAlliance ? "blue" : "red",
        opponentTeams: allTeams,
        ourAlliance: null,
      };
    }
  }

  const hasRedTeams = nextMatchRed.length > emptyArrayLength;
  const hasBlueTeams = nextMatchBlue.length > emptyArrayLength;

  if (hasRedTeams && hasBlueTeams) {
    const redNotOurs = nextMatchRed.filter(
      (team) => !currentTeamKeys.includes(team)
    );
    const blueNotOurs = nextMatchBlue.filter(
      (team) => !currentTeamKeys.includes(team)
    );

    if (
      redNotOurs.length > emptyArrayLength &&
      blueNotOurs.length > emptyArrayLength
    ) {
      return {
        opponentAlliance: isRedAlliance ? "blue" : "red",
        opponentTeams: isRedAlliance ? blueNotOurs : redNotOurs,
        ourAlliance: null,
      };
    }
    if (redNotOurs.length > emptyArrayLength) {
      return {
        opponentAlliance: "red",
        opponentTeams: redNotOurs,
        ourAlliance: "blue",
      };
    }
    if (blueNotOurs.length > emptyArrayLength) {
      return {
        opponentAlliance: "blue",
        opponentTeams: blueNotOurs,
        ourAlliance: "red",
      };
    }
  }

  if (hasRedTeams) {
    const redNotOurs = nextMatchRed.filter(
      (team) => !currentTeamKeys.includes(team)
    );
    if (redNotOurs.length > emptyArrayLength) {
      return {
        opponentAlliance: "red",
        opponentTeams: redNotOurs,
        ourAlliance: "blue",
      };
    }
  }

  if (hasBlueTeams) {
    const blueNotOurs = nextMatchBlue.filter(
      (team) => !currentTeamKeys.includes(team)
    );
    if (blueNotOurs.length > emptyArrayLength) {
      return {
        opponentAlliance: "blue",
        opponentTeams: blueNotOurs,
        ourAlliance: "red",
      };
    }
  }

  return null;
}

function formatOpponentLabel(opponentTeams: string[]): string {
  if (opponentTeams.length === emptyArrayLength) {
    return "TBD";
  }
  return opponentTeams.map((key) => key.replace("frc", "")).join(", ");
}

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
