// בס"ד
import * as t from "io-ts";

const matchType = t.keyof({
  practice: null,
  qualification: null,
  playoff: null,
});

export const competitionCodec = t.keyof({
  testing: null,
  isde1: null,
  isde2: null,
  isde3: null,
  isde4: null,
  iscmp: null,
  "2026cahal": null,
  "2026arc": null,
  "2026cur": null,
  "2026dal": null,
  "2026gal": null,
  "2026hop": null,
  "2026joh": null,
  "2026mil": null,
  "2026new": null,
  "2026cmptx": null,
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
