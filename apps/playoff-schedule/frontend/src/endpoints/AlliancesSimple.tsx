// בס"ד
import * as t from "io-ts";

export const allianceSimple = t.type({
  name: t.string,
  picks: t.array(t.string),
  declines: t.array(t.string),
  backup: t.union([
    t.null,
    t.type({
      in: t.string,
      out: t.string,
    }),
  ]),
});

export type AllianceSimpleType = typeof allianceSimple._A;

export const urlAlliances = (eventKey: string): string =>
  `/events/${eventKey}/alliances`;
