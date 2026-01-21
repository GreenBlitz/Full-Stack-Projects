// בס"ד
import * as t from "io-ts";
import { intervalCodec } from "./Interval";

export const point = t.type({ x: t.number, y: t.number });
export type Point = t.TypeOf<typeof point>;

export const shootEventCodec = t.type({
  interval: intervalCodec,
  startPosition: point,
});
