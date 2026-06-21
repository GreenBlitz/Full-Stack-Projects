//בס"ד
import * as t from "io-ts";

const superCodec = t.type({
  defence: t.number,
  evasion: t.number,
  driving: t.number,
});

const gameSectionCode = t.type({
  fuelPassed: t.number,
  fuelScored: t.number,
});

const teamDataCodec = t.type({
  auto: gameSectionCode,
  tele: gameSectionCode,
  super: superCodec,
});

export type TeamPageTeamBeeData = t.TypeOf<typeof teamDataCodec>;

export type TeamPageBeeData = Record<string, TeamPageTeamBeeData>;
