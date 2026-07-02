//בס"ד
import * as t from "io-ts";

const superPerGameCodec = t.record(t.string, t.number);

const superCodec = t.type({
  defense: t.number,
  evasion: t.number,
  driving: t.number,
  defensePerGame: superPerGameCodec,
  evasionPerGame: superPerGameCodec,
});

const fuelAverageCodec = t.type({
  passed: t.number,
  scored: t.number,
});

const fuelPerGameCodec = t.type({
  fuelScoredPerGame: t.record(t.string, t.number),
  fuelPassedPerGame: t.record(t.string, t.number),
});

const gameSectionCode = t.type({
  fuelAverage: fuelAverageCodec,
  fuelPerGame: fuelPerGameCodec,
});

const teamDataCodec = t.type({
  auto: gameSectionCode,
  tele: gameSectionCode,
  total: gameSectionCode,
  super: superCodec,
  notes: t.array(t.string),
});

export type TeamPageTeamBeeData = t.TypeOf<typeof teamDataCodec>;

export type TeamPageBeeData = Record<string, TeamPageTeamBeeData>;
