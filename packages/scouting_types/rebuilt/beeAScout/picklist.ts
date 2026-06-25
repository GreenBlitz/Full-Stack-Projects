import * as t from "io-ts";

export const picklistBeeCodec = t.type({
  name: t.string,
  list: t.array(t.string),
});
export type PicklistBee = t.TypeOf<typeof picklistBeeCodec>;
