//בס"ד

import * as t from "io-ts";

const pitScoutNumberMetricCodec = t.union([t.undefined, t.number]);

const pitScoutBooleanMetricCodec = t.union([t.boolean, t.undefined]);

const pitScoutStringMetricCodec = t.union([t.undefined, t.string]);

const pitScoutBooleanCodec = t.type({
  hasTurret: pitScoutBooleanMetricCodec,
  canPassTrench: pitScoutBooleanMetricCodec,
  canPassBumpEasily: pitScoutBooleanMetricCodec,
});

const pitScoutNumberCodec = t.type({
  robotWeight: pitScoutNumberMetricCodec,
  ballCapacity: pitScoutNumberMetricCodec,
});

export const pitScoutCodec = t.type({
  teamNumber: t.number,
  numberMetrics: pitScoutNumberCodec,
  booleanMetrics: pitScoutBooleanCodec,
  extraInfo: pitScoutStringMetricCodec,
});
export type PitScout = t.TypeOf<typeof pitScoutCodec>;
export type PitScoutNumber = t.TypeOf<typeof pitScoutNumberCodec>;
export type PitScoutNumberKey = keyof PitScoutNumber;
export type PitScoutBoolean = t.TypeOf<typeof pitScoutBooleanCodec>;
export type PitScoutBooleanKey = keyof PitScoutBoolean;
export type PitScoutNumberMetric = t.TypeOf<typeof pitScoutNumberMetricCodec>;
export type PitScoutBooleanMetric = t.TypeOf<typeof pitScoutBooleanMetricCodec>;
export type PitMetricKey = keyof Omit<PitScout, "teamNumber">;
