// בס"ד
import * as t from "io-ts";
import { autoCodec, teleCodec } from "./Segments";

const matchType = t.keyof({
  practice: null,
  qualification: null,
  playoff: null,
});


export const scoutingFormCodec = t.type({
  scouterName: t.string,
  matchNumber: t.number,
  matchType,
  teamNumber: t.number,
  auto: autoCodec,
  tele: teleCodec,
  comment: t.string,
});

export type ScoutingForm = t.TypeOf<typeof scoutingFormCodec>;
