// בס"ד
import * as t from "io-ts";
import { eventCodec } from "./Event";

const point = t.type({ x: t.number, y: t.number });

export const shootEventCodec = t.intersection([
  eventCodec,
  t.type({ interval: t.number, start: point }),
]);
