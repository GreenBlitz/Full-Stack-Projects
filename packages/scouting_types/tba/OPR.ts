// בס"ד

import * as t from "io-ts";
export const teamOPRCodec = t.type({
  teamNumber: t.number,
  opr: t.number,
});

export type TeamOPR = t.TypeOf<typeof teamOPRCodec>;
