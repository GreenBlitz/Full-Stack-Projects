// בס"ד
import * as t from "io-ts";
import { matchCodec, teleCodec, type Match } from "../scouting_form";
import { allianceCodec } from "../../alliance";

export const teamSuperScoutCodec = teleCodec;

type SuperMetricsRatings = {
  [Metric in SuperMetricKey]: number;
};
export type TeamSuperScoutNumbers = {
  teamNumber: number;
} & SuperMetricsRatings;

export type TeamSuperScout = t.TypeOf<typeof teamSuperScoutCodec>;
export type SuperMetricKey = keyof Omit<TeamSuperScout, "teamNumber">;
export type MatchType = Match["type"];
