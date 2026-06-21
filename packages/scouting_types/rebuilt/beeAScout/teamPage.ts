//בס"ד
import * as t from "io-ts";

const superCodec = t.type({
  defense: t.number,
  evasion: t.number,
  driving: t.number,
});

const gameSectionCode = t.type({
  fuelPassedAverage: t.number,
  fuelScoredAverage: t.number,
  fuelScoredPerGame: t.record(t.string, t.number),
  fuelPassedPerGame: t.record(t.string, t.number),
});

const teamDataCodec = t.type({
  auto: gameSectionCode,
  tele: gameSectionCode,
  super: superCodec,
});

export type TeamPageTeamBeeData = t.TypeOf<typeof teamDataCodec>;

export type TeamPageBeeData = Record<string, TeamPageTeamBeeData>;
