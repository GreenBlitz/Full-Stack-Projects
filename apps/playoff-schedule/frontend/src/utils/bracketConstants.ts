// בס"ד
import type { BracketMapping } from "./bracketTypes";

export const bracketStructure: Record<number, BracketMapping> = {
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

export const potentialOpponentsFirst = 1;
export const opponentTeamsLength = 0;
export const alliancesLength = 0;
export const firstMatchIndex = 0;
export const nextMatchIndex = 1;
export const minBracketMatch = 1;
export const maxBracketMatch = 13;
export const firstMatchNumber = 1;
export const emptyArrayLength = 0;
export const finalsBracketNumber = 0;
export const firstArrayIndex = 0;
export const twoPotentialOpponents = 2;

export const matchNumbers = {
  match1: 1,
  match2: 2,
  match3: 3,
  match4: 4,
  match5: 5,
  match6: 6,
  match7: 7,
  match8: 8,
  match9: 9,
  match10: 10,
  match11: 11,
  match12: 12,
  match13: 13,
};

export const matchNumberRegex = /Match (\d+)/;
export const allianceNumberRegex = /Alliance (\d+)/i;
export const parseIntRadix = 10;
export const nextMatchLimit = 2;
