// בס"ד
import * as t from "io-ts";
import { matchCodec } from "../scouting_form";
import { allianceCodec } from "../../alliance";

const sectionCodec = t.type({
  rating: t.union([
    t.undefined,
    t.keyof({ 1: null, 2: null, 3: null, 4: null }),
  ]),
  info: t.union([t.undefined, t.string]),
});

const teamSuperScoutCodec = t.type({
  defense: sectionCodec,
  evasion: sectionCodec,
  perception: sectionCodec,
  trench: sectionCodec,
  bump: sectionCodec,
  collection: sectionCodec,
  moveShoot: sectionCodec,
});

export const superScoutCodec = t.type({
  match: matchCodec,
  alliance: allianceCodec,
  teams: t.union([
    teamSuperScoutCodec,
    teamSuperScoutCodec,
    teamSuperScoutCodec,
  ]),
});

export type SuperScout = t.TypeOf<typeof superScoutCodec>;
export type SuperRating = t.TypeOf<typeof sectionCodec>["rating"];
