// בס"ד
import * as t from "io-ts";
import { shootEventCodec } from "./ShootEvent";
import { intervalCodec } from "./Interval";

export const shiftCodec = t.type({
  shootEvents: t.array(shootEventCodec),
});

export const levelTimeCodec = t.union([intervalCodec, t.null]);

export const climbTimeCodec = t.type({
  L1: levelTimeCodec,
  L2: levelTimeCodec,
  L3: levelTimeCodec,
});

export const climbCodec = t.type({
  climbTime: climbTimeCodec,
  climbSide: t.keyof({
    none: null,
    middle: null,
    side: null,
    support: null,
  }),
  level: t.keyof({
    L0: null,
    L1: null,
    L2: null,
    L3: null,
  }),
});

export const activeClimbLevelCodec = t.keyof({
  L1: null,
  L2: null,
  L3: null,
});

type Interval = t.TypeOf<typeof intervalCodec>;

export type SingleLevelTime = Partial<Record<"L1" | "L2" | "L3", Interval>>;

export type Climb = t.TypeOf<typeof climbCodec>;
export type ClimbSide = Climb["climbSide"];
export type ClimbLevel = Climb["level"];
export type ClimbTime = Climb["climbTime"];

export const climbSideValues = Object.keys(
  climbCodec.props.climbSide.keys,
) as ClimbSide[];
