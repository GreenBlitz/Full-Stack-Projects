// בס"ד
import * as t from "io-ts";
import { shootEventCodec } from "./ShootEvent";
import { intervalCodec } from "./Interval";
import type { autoClimbCodec } from "./Segments";
import type { ScoutingForm } from "./ScoutingForm";

export const shiftCodec = t.type({
  shootEvents: t.array(shootEventCodec),
});
export const defaultShift: t.TypeOf<typeof shiftCodec> = {
  shootEvents: [],
};

export type Shift = t.TypeOf<typeof shiftCodec>;
export type ShiftsArray = Shift[];

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

export type Climb = ScoutingForm["auto" | "tele"]["climb"];
export type ClimbLevel = Climb["level"];

export type TeleClimb = t.TypeOf<typeof climbCodec>;
export type TeleClimbSide = TeleClimb["climbSide"];
export type TeleClimbLevel = TeleClimb["level"];
export type TeleClimbTime = TeleClimb["climbTime"];

export type ShiftType = "auto" | "transition" | "teleop" | "endgame";

export const defaultClimb: t.TypeOf<typeof climbCodec> = {
  climbTime: {
    L1: null,
    L2: null,
    L3: null,
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
    L1: null,
  },
  climbSide: {
    middle: false,
    side: false,
    support: false,
  },
  level: "L0",
};
