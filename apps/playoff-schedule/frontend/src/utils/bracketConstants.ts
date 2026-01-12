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
export const opponentTeamsLength = 0;
export const firstMatchIndex = 0;
export const nextMatchIndex = 1;
export const minBracketMatch = 1;
export const maxBracketMatch = 13;
export const firstMatchNumber = 1;
export const emptyArrayLength = 0;
export const finalsBracketNumber = 0;
export const firstArrayIndex = 0;

export const match1 = 1;
export const match2 = 2;
export const match3 = 3;
export const match4 = 4;
export const match5 = 5;
export const match6 = 6;
export const match7 = 7;
export const match8 = 8;
export const match9 = 9;
export const match10 = 10;
export const match11 = 11;
export const match12 = 12;
export const match13 = 13;
