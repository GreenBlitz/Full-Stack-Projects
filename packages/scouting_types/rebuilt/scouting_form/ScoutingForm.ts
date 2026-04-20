// בס"ד
import * as t from "io-ts";
import { autoCodec, defaultAuto, defaultTele, teleCodec } from "./Segments";
import { competitionCodec } from "./GameData";

export const CURRENT_COMPETITION = "2026cahal";

const matchType = t.keyof({
  practice: null,
  qualification: null,
  playoff: null,
});

export const matchCodec = t.type({
  number: t.number,
  type: matchType,
});

export const scoutingFormCodec = t.type({
  scouterName: t.string,
  competition: competitionCodec,
  match: matchCodec,
  teamNumber: t.number,
  auto: autoCodec,
  tele: teleCodec,
  comment: t.string,
  robotBroken: t.boolean,
  noShow: t.boolean,
});

export type ScoutingForm = t.TypeOf<typeof scoutingFormCodec>;
export type Match = t.TypeOf<typeof matchCodec>;

export const defaultScoutForm: ScoutingForm = {
  scouterName: "",
  competition: CURRENT_COMPETITION,
  match: {
    number: 0,
    type: "qualification",
  },
  teamNumber: 0,
  auto: defaultAuto,
  tele: defaultTele,
  comment: "",
  robotBroken: false,
  noShow: false,
};

export const isNoShowForm = (form: { noShow?: boolean }): boolean =>
  Boolean(form.noShow);

export const excludeNoShowForms = (forms: ScoutingForm[]): ScoutingForm[] =>
  forms.filter((f) => !isNoShowForm(f));
