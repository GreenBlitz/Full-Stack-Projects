// בס"ד
import * as t from "io-ts";
import { stringOrNull } from "../utils/TypeUtils";

export const simpleEventsInYear = t.type({
  //did
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

/**
 *
 * @param year in urlEventsInYear switch to curr year: now.getFullYear()
 * @returns
 */
export const urlEventsInYear = (year: number /*or curr time*/) =>
  `https://www.thebluealliance.com/api/v3/events/${year}/simple`;
