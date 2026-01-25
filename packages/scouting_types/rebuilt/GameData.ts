// בס"ד
import * as t from "io-ts";

const matchType = t.keyof({
  practice: null,
  qualification: null,
  playoff: null,
});

export const gameDataCodec = t.type({
  matchNumber: t.number,
  matchType,
  startTime: t.string,
});

export const gamesArrayCodec = t.array(gameDataCodec);

export type GameData = t.TypeOf<typeof gameDataCodec>;
