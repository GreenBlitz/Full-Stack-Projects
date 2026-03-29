// בס"ד
import * as t from "io-ts";
import { autoCodec, defaultAuto, defaultTele, teleCodec } from "./Segments";
import { competitionCodec } from "./GameData";

export const CURRENT_COMPETITION = "TESTING";

const matchType = t.keyof({
  practice: null,
  qualification: null,
  playoff: null,
});

export const matchCodec = t.type({
  number: t.number,
  type: matchType,
});

const scoutingFormBodyCodec = t.type({
  scouterName: t.string,
  competition: competitionCodec,
  match: matchCodec,
  teamNumber: t.number,
  auto: autoCodec,
  tele: teleCodec,
  comment: t.string,
  robotBroken: t.boolean,
});

/** Canonical shape (e.g. app state, DB documents you control). */
export const scoutingFormCodec = t.intersection([
  scoutingFormBodyCodec,
  t.type({ noShow: t.boolean }),
]);

/**
 * Accepts POST bodies that omit `noShow` (legacy clients); normalize with {@link normalizeScoutingForm}.
 */
export const scoutingFormIncomingPostCodec = t.intersection([
  scoutingFormBodyCodec,
  t.partial({ noShow: t.boolean }),
]);

export type ScoutingForm = t.TypeOf<typeof scoutingFormCodec>;
export type ScoutingFormIncomingPost = t.TypeOf<
  typeof scoutingFormIncomingPostCodec
>;
export type Match = t.TypeOf<typeof matchCodec>;

export const normalizeScoutingForm = (
  form: ScoutingFormIncomingPost,
): ScoutingForm => ({
  ...form,
  noShow: form.noShow ?? false,
});

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

/** Treats missing `noShow` as false (e.g. legacy Mongo documents). */
export const isNoShowForm = (form: { noShow?: boolean }): boolean =>
  Boolean(form.noShow);

export const excludeNoShowForms = (forms: ScoutingForm[]): ScoutingForm[] =>
  forms.filter((f) => !isNoShowForm(f));
