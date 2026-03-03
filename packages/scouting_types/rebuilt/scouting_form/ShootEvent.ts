// בס"ד
import * as t from "io-ts";
import { intervalCodec } from "./Interval";

export const point = t.type({ x: t.number, y: t.number });
export type Point = t.TypeOf<typeof point>;

export const shootEventCodec = t.type({
  interval: intervalCodec,
  positions: t.array(point),
});

export type ShootEvent = t.TypeOf<typeof shootEventCodec>;
