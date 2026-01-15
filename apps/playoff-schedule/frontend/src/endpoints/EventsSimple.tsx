// בס"ד
import * as t from "io-ts";
import { stringOrNull } from "../utils/TypeUtils";

export const simpleEventsInYear = t.type({
  city: stringOrNull,
  country: stringOrNull,
  district: t.unknown /*null*/,
  end_date: t.string,
  event_code: t.string,
  event_type: t.number,
  key: t.string,
  name: t.string,
  start_date: t.string,
  state_prov: stringOrNull,
  year: t.number,
});
export type EventsInYearType = typeof simpleEventsInYear._A;


