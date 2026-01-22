// בס"ד
import * as t from "io-ts";
import { shootEventCodec } from "./ShootEvent";
import { intervalCodec } from "./Interval";

export const shiftCodec = t.type({
  shootEvents: t.array(shootEventCodec),
});

export const climbCodec = t.type({
  interval: intervalCodec,
  climbSide: t.keyof({
    middle: null,
    side: null,
    support: null,
  }),
  level: t.keyof({
    none: null,
    L1: null,
    L2: null,
    L3: null,
  }),
});
