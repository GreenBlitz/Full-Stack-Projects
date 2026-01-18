// בס"ד
import * as t from "io-ts";
import { intervalCodec } from "./Interval";

const point = t.type({ x: t.number, y: t.number });

export const shootEventCodec = t.type({
  time: t.number,
  interval: intervalCodec,
  start: point,
});
