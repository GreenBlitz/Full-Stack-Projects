//בס"ד

import * as t from "io-ts";

const pitScoutNumberCodec = t.union([t.undefined, t.string]);

const pitScoutBooleanCodec = t.union([t.boolean, t.undefined]);

export const pitScoutCodec = t.type({
  teamNumber: t.number,
  robotWeight: pitScoutNumberCodec,
  ballCapacity: pitScoutNumberCodec,
  hasTurret: pitScoutBooleanCodec,
  canPassTrench: pitScoutBooleanCodec,
  canPassBumpEasily: pitScoutBooleanCodec,
  extraInfo: pitScoutNumberCodec,
});

export type PitScout = t.TypeOf<typeof pitScoutCodec>;
export type pitScoutNumber = t.TypeOf<typeof pitScoutNumberCodec>;
export type pitScoutBoolean = t.TypeOf<typeof pitScoutBooleanCodec>;
export type PitMetricKey = keyof Omit<PitScout, "teamNumber">;
