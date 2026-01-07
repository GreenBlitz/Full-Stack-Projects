// בס"ד

import * as t from "io-ts";
import { simpleAlliance } from "./SimpleAlliance";
import { numberOrNull } from "../utils/TypeUtils";

export const matchSimple = t.type({
  actual_time: numberOrNull,
  alliances: t.type({
    blue: simpleAlliance,
    red: simpleAlliance,
  }),
  comp_level: t.string,
  event_key: t.string,
  key: t.string,
  match_number: t.number,
  predicted_time: numberOrNull,
  set_number: t.number,
  time: numberOrNull,
  winning_alliance: t.string,
});

export type MatchesSimpleType = typeof matchSimple._A;

export const urlMatches = (eventKey: string) =>
  `/events/${eventKey}/matches`;

