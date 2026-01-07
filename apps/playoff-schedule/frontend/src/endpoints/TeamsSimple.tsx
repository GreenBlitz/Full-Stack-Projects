// בס"ד
import * as t from "io-ts";
import { stringOrNull } from "../utils/TypeUtils";

export const simpleTeamsInEvent = t.type({//did
  city: stringOrNull,
  country: stringOrNull,
  key: t.string,
  name: t.string,
  nickname: t.string,
  state_prov: stringOrNull,
  team_number: t.number,
});
export type TeamsInEventType = typeof simpleTeamsInEvent._A;

export const urlTeamsInEvent = (eventKey: string) =>
  `/events/${eventKey}/teams`;