// בס"ד
import * as t from "io-ts";
import { shootEventCodec } from "./ShootEvent";
import { intervalCodec, maxInterval } from "./Interval";
import type { autoClimbCodec } from "./Segments";

export const shiftCodec = t.type({
  shootEvents: t.array(shootEventCodec),
});
export const defaultShift: t.TypeOf<typeof shiftCodec> = {
  shootEvents: [],
};

export const levelTimeCodec = t.union([intervalCodec, t.null]);

export const climbTimeCodec = t.type({
  L1: levelTimeCodec,
  L2: levelTimeCodec,
  L3: levelTimeCodec,
});

export const climbCodec = t.type({
  climbTime: climbTimeCodec,
  climbSide: t.type({
    middle: t.boolean,
    side: t.boolean,
    support: t.boolean,
  }),
  level: t.keyof({
    L0: null,
    L1: null,
    L2: null,
    L3: null,
  }),
});

type ActiveClimbLevel = "L1" | "L2" | "L3";
type Interval = t.TypeOf<typeof intervalCodec>;

export type SingleLevelTime = Partial<Record<ActiveClimbLevel, Interval>>;

export type TeleClimb = t.TypeOf<typeof climbCodec>;
export type ClimbSide = TeleClimb["climbSide"];
export type ClimbLevel = TeleClimb["level"];
export type ClimbTime = TeleClimb["climbTime"];

export const defaultClimb: t.TypeOf<typeof climbCodec> = {
  climbTime: {
    L1: maxInterval,
    L2: maxInterval,
    L3: maxInterval,
  },
  climbSide: {
    middle: false,
    side: false,
    support: false,
  },
  level: "L0",
};

export const defaultAutoClimb: t.TypeOf<typeof autoClimbCodec> = {
  climbTime: {
    L1: maxInterval,
  },
  climbSide: {
    middle: false,
    side: false,
    support: false,
  },
  level: "L0",
};
