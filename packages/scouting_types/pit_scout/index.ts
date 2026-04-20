//בס"ד

import * as t from "io-ts";

const pitScoutAnswerCodec = t.union([t.undefined, t.string]);

const pitScoutBooleanCodec = t.union([t.boolean, t.undefined]);

export const pitScoutCodec = t.type({
  teamNumber: t.number,
  robotWeight: pitScoutAnswerCodec,
  ballCapacity: pitScoutAnswerCodec,
  hasTurret: pitScoutBooleanCodec,
  canPassTrench: pitScoutBooleanCodec,
  canPassBumpEasily: pitScoutBooleanCodec,
  extraInfo: pitScoutAnswerCodec,
});

export type PitScout = t.TypeOf<typeof pitScoutCodec>;
