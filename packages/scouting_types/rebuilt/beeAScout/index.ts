//בס"ד

import * as t from "io-ts";

const climbCodec = t.type({
  height: t.keyof({
    0: null,
    1: null,
    2: null,
    3: null,
  }),
});

const fuelCodec = t.type({
  scored: t.number,
  passed: t.number,
});

const autoCodec = t.type({
  fuel: fuelCodec,
  climb: t.boolean,
});

const teleCodec = t.type({
  fuel: fuelCodec,
  climb: climbCodec,
});

const superCodec = t.type({
  driveLevel: t.number,
  didDefense: t.boolean,
  defenseLevel: t.number,
  didEvasions: t.boolean,
  evasionLevel: t.number,
});

const beeScoutingFormCodec = t.type({
  teamNumber: t.number,
  matchNumber: t.number,
  auto: autoCodec,
  tele: teleCodec,
  super: superCodec,
  comp: t.string,
});

export type BeeScoutingForm = t.TypeOf<typeof beeScoutingFormCodec>;
