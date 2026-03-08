// בס"ד
import * as t from "io-ts";
import { matchCodec, type Match } from "../scouting_form";
import { allianceCodec } from "../../alliance";

export const sectionCodec = t.type({
  rating: t.union([
    t.undefined,
    t.keyof({ "1": null, "2": null, "3": null, "4": null }),
  ]),
  info: t.union([t.undefined, t.string]),
});

export const teamSuperScoutCodec = t.type({
  defense: sectionCodec,
  evasion: sectionCodec,
  perception: sectionCodec,
  trench: sectionCodec,
  bump: sectionCodec,
  collection: sectionCodec,
  moveShoot: sectionCodec,
  teamNumber: t.number,
});

export const superScoutCodec = t.type({
  match: matchCodec,
  alliance: allianceCodec,
  teams: t.tuple([
    teamSuperScoutCodec,
    teamSuperScoutCodec,
    teamSuperScoutCodec,
  ]),
});

export type SuperScout = t.TypeOf<typeof superScoutCodec>;
export type SuperSection = t.TypeOf<typeof sectionCodec>;
export type SuperRating = SuperSection["rating"];
export type SuperRatingValue = Exclude<SuperRating, undefined>;
export type TeamSuperScout = t.TypeOf<typeof teamSuperScoutCodec>;
export type SuperMetricKey = keyof Omit<TeamSuperScout, "teamNumber">;
export type AllianceTeams = SuperScout["teams"];
export type MatchType = Match["type"];
