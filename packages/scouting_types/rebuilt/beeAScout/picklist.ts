import * as t from "io-ts";
import { type GeneralTeamBeeData } from "./general";

export const picklistBeeCodec = t.type({
  name: t.string,
  list: t.array(t.string),
});
export type PicklistBee = t.TypeOf<typeof picklistBeeCodec>;

export interface DataPicklistBee {
  name: string;
  list: GeneralTeamBeeData[];
}
