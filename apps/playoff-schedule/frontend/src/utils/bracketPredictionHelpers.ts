// בס"ד
import type { OpponentInfo } from "./bracketTypes";
import {
  emptyArrayLength,
  potentialOpponentsFirst,
  twoPotentialOpponents,
} from "./bracketConstants";

export interface AllianceInfo {
  alliance: "red" | "blue";
  teams: string[];
  opponent?: "red" | "blue";
}

export const checkDirectlyScheduledOpponent = (
  nextMatchAlliances: AllianceInfo[],
  currentTeamKeys: string[]
): OpponentInfo | null => {
  const ourAllianceEntry = nextMatchAlliances.find(({ teams }) =>
    currentTeamKeys.some((team) => teams.includes(team))
  );

  if (ourAllianceEntry) {
    const opponentData = nextMatchAlliances.find(
      (alli) => alli.alliance === ourAllianceEntry.opponent
    );
    if (opponentData) {
      return {
        opponentAlliance: opponentData.alliance,
        opponentTeams: opponentData.teams,
        ourAlliance: ourAllianceEntry.alliance,
      };
    }
  }
  return null;
};

export const predictNextOpponentFromPotential = (
  nextMatchAlliances: AllianceInfo[],
  currentTeamKeys: string[],
  isRedAlliance: boolean
): OpponentInfo | null => {
  const potentialNextOpponents = nextMatchAlliances
    .map(({ alliance, teams }) => ({
      alliance,
      teams: teams.filter((t) => !currentTeamKeys.includes(t)),
    }))
    .filter((p) => p.teams.length > emptyArrayLength);

  if (potentialNextOpponents.length === twoPotentialOpponents) {
    const blueOpponent = potentialNextOpponents.find(
      (p) => p.alliance === "blue"
    );
    const redOpponent = potentialNextOpponents.find(
      (p) => p.alliance === "red"
    );

    if (blueOpponent && redOpponent) {
      return {
        opponentAlliance: isRedAlliance ? "blue" : "red",
        opponentTeams: isRedAlliance ? blueOpponent.teams : redOpponent.teams,
        ourAlliance: null,
      };
    }
  }

  if (potentialNextOpponents.length === potentialOpponentsFirst) {
    const [opponent] = potentialNextOpponents;
    return {
      opponentAlliance: opponent.alliance,
      opponentTeams: opponent.teams,
      ourAlliance: opponent.alliance === "red" ? "blue" : "red",
    };
  }

  return null;
};
