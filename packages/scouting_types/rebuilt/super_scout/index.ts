// בס"ד
import * as t from "io-ts";
import { matchCodec, type Match } from "../scouting_form";
import { allianceCodec } from "../../alliance";

export const teamSuperScoutCodec = t.type({
  active: t.string,
  inactive: t.string,
  driving: t.type({
    comments: t.string,
    rating: t.union([
      t.keyof({
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null,
        7: null,
      }),
      t.undefined,
    ]),
  }),
  faults: t.string,
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

type SuperMetricsRatings = {
  [Metric in SuperMetricKey]: number;
};
export type TeamSuperScoutNumbers = {
  teamNumber: number;
} & SuperMetricsRatings;

export type SuperScout = t.TypeOf<typeof superScoutCodec>;
export type TeamSuperScout = t.TypeOf<typeof teamSuperScoutCodec>;
export type SuperMetricKey = keyof Omit<TeamSuperScout, "teamNumber">;
export type AllianceTeams = SuperScout["teams"];
export type MatchType = Match["type"];
