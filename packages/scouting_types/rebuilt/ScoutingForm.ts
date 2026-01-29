// בס"ד
import * as t from "io-ts";
import { autoCodec, defaultAuto, defaultTele, teleCodec } from "./Segments";

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

export const defaultScoutForm: ScoutingForm = {
  scouterName: "",
  matchNumber: 0,
  matchType: "qualification",
  teamNumber: 0,
  auto: defaultAuto,
  tele: defaultTele,
  comment: "",
};

export type ScoutingForm = t.TypeOf<typeof scoutingFormCodec>;

