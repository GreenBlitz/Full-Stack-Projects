// בס"ד
import * as t from "io-ts";
import { shootEventCodec } from "./ShootEvent";
import { intervalCodec, maxInterval } from "./Interval";

export const shiftCodec = t.type({
  shootEvents: t.array(shootEventCodec),
});
export const defaultShift: t.TypeOf<typeof shiftCodec> = {
  shootEvents: [],
};

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

export const defaultClimb: t.TypeOf<typeof climbCodec> = {
  interval: maxInterval,
  climbSide: "middle",
  level: "none",
};
