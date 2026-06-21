//בס"ד

import * as t from "io-ts";

const pitScoutBooleanMetricCodec = t.union([t.boolean, t.undefined]);

const pitScoutStringMetricCodec = t.union([t.undefined, t.string]);

const pitScoutBooleanCodec = t.type({
  hasTurret: pitScoutBooleanMetricCodec,
  canPassTrench: pitScoutBooleanMetricCodec,
});

export const pitScoutCodec = t.type({
  teamNumber: t.number,
  booleanMetrics: pitScoutBooleanCodec,
  extraInfo: pitScoutStringMetricCodec,
});
export type PitScout = t.TypeOf<typeof pitScoutCodec>;
export type PitScoutBoolean = t.TypeOf<typeof pitScoutBooleanCodec>;
export type PitScoutBooleanKey = keyof PitScoutBoolean;
export type PitScoutBooleanMetric = t.TypeOf<typeof pitScoutBooleanMetricCodec>;
export type PitMetricKey = keyof Omit<PitScout, "teamNumber">;
