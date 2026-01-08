// בס"ד
import * as t from "io-ts";
import type { AtMost } from "./Utils";

export const matchesProps = t.type({
  event: t.string,
});

export type TBAMatchesProps = t.TypeOf<typeof matchesProps>;

type MaxTeamsInAlliance = 3;
type TeamKeys = AtMost<string, MaxTeamsInAlliance>;

export interface TBAAlliance {
  score: number;
  team_keys: TeamKeys;
  surrogate_team_keys: TeamKeys;
  dq_team_keys: TeamKeys;
}

export interface TBAMatch<AllianceBreakdown, MiscBreakdown = {}> {
  key: "string";
  comp_level: "qm";
  set_number: number;
  match_number: number;
  alliances: {
    red: TBAAlliance;
    blue: TBAAlliance;
  };
  winning_alliance: "red" | "blue" | ""; // "" is a tie
  event_key: string;
  time: number;
  actual_time: number;
  predicted_time: number;
  post_result_time: number;
  score_breakdown: {
    red: AllianceBreakdown;
    blue: AllianceBreakdown;
  } & MiscBreakdown;
  videos: {
    type: string;
    key: string;
  }[];
}
