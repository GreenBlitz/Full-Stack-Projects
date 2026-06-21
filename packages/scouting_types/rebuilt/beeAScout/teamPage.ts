//בס"ד
import * as t from "io-ts";

const superCodec = t.type({
  defence: t.number,
  evasion: t.number,
  driving: t.number,
});

const gameSectionCode = t.type({
  points: t.number,
  passed: t.number,
  scored: t.number,
});

const teamDataCodec = t.type({
  teamNumber: t.number,
  auto: gameSectionCode,
  tele: gameSectionCode,
  super: superCodec,
});

export type TeamData = t.TypeOf<typeof teamDataCodec>;
