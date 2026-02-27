import { Match, matchCodec, point, Point, ShootEvent } from "../scouting_form";
import * as t from "io-ts";

const bpsEventCodec = t.type({
  shoot: t.array(t.number),
  score: t.array(t.number),
  positions: t.array(point),
});

export type BPSEvent = t.TypeOf<typeof bpsEventCodec>;

export const bpsCodec = t.type({
  events: t.array(bpsEventCodec),
  match: matchCodec,
  team: t.number,
});

export type BPS = t.TypeOf<typeof bpsCodec>;

export interface TeamBPS {
  bpses: BPS[];
  team: number;
}

export interface BPSBlueprint {
  teamGames: Record<
    string,
    { team: number; match: Match; events: ShootEvent[] }[]
  >;
}
