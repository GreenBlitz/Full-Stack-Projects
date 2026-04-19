// בס"ד
import * as t from "io-ts";
import type { Either } from "fp-ts/lib/Either";
import type { Errors } from "io-ts";
import type { Competition } from "../rebuilt/scouting_form/GameData";
import type { Match } from "../rebuilt";
import { compareMatches, tbaScheduleFieldsToMatch } from "./MatchNumbering";

/** One row of a hand-entered schedule (TBA-style levels: qm, pc, sf, f, …). */
export const manualScheduleRowCodec = t.type({
  comp_level: t.string,
  set_number: t.number,
  match_number: t.number,
  red: t.array(t.number),
  blue: t.array(t.number),
});

export type ManualScheduleRow = t.TypeOf<typeof manualScheduleRowCodec>;

export const manualScheduleArrayCodec = t.array(manualScheduleRowCodec);

export type ScheduleSlot = {
  match: Match;
  redAlliance: number[];
  blueAlliance: number[];
};

export const manualRowsToScheduleSlots = (
  rows: ManualScheduleRow[],
): ScheduleSlot[] =>
  rows
    .map((row) => ({
      match: tbaScheduleFieldsToMatch(
        row.comp_level,
        row.set_number,
        row.match_number,
      ),
      redAlliance: row.red,
      blueAlliance: row.blue,
    }))
    .sort((a, b) => compareMatches(a.match, b.match));

const matchSlotKey = (m: Match) => `${m.type}:${m.number}`;

/** Manual rows override TBA-derived slots when the app `Match` is the same. */
export const mergeSchedulePreferManual = (
  tbaSlots: ScheduleSlot[],
  manualSlots: ScheduleSlot[],
): ScheduleSlot[] => {
  const byKey = new Map<string, ScheduleSlot>();
  for (const slot of tbaSlots) {
    byKey.set(matchSlotKey(slot.match), slot);
  }
  for (const slot of manualSlots) {
    byKey.set(matchSlotKey(slot.match), slot);
  }
  return [...byKey.values()].sort((a, b) =>
    compareMatches(a.match, b.match),
  );
};

export type ManualSchedulesByCompetition = Partial<
  Record<Competition, ManualScheduleRow[]>
>;

export const decodeManualScheduleJson = (
  raw: unknown,
): Either<Errors, ManualScheduleRow[]> => manualScheduleArrayCodec.decode(raw);
