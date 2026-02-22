// בס"ד
import * as t from "io-ts";

const matchType = t.keyof({
  practice: null,
  qualification: null,
  playoff: null,
});

export const competitionCodec = t.keyof({
  TESTING: null,
  ISDE1: null,
  ISDE2: null,
  ISDE3: null,
  ISDE4: null,
  ISCMP: null,
  ARCHIMEDES: null,
  CMPTX: null,
  CURIE: null,
  DALY: null,
  GALILEO: null,
  HOPPER: null,
  JOHNSON: null,
  MILSTEIN: null,
  NEWTON: null,
});

export const gameDataCodec = t.type({
  matchNumber: t.number,
  matchType,
  startTime: t.string,
  competition: competitionCodec,
});

export const competitions = Object.keys(competitionCodec.keys);

export const gamesArrayCodec = t.array(gameDataCodec);

export type Competition = t.TypeOf<typeof competitionCodec>;

export type GameData = t.TypeOf<typeof gameDataCodec>;
