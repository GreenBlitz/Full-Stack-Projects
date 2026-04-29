// בס"ד
import * as t from "io-ts";
import { defaultMovement, teleMovementCodec } from "./Movement";
import {
  climbCodec,
  defaultAutoClimb,
  defaultClimb,
  levelTimeCodec,
} from "./Shift";
import { point } from "./ShootEvent";

export const autoClimbTimeCodec = t.type({
  L1: levelTimeCodec,
});

export const autoClimbCodec = t.type({
  climbSide: climbCodec.props.climbSide,
  climbTime: autoClimbTimeCodec,
  level: t.keyof({
    L0: null,
    L1: null,
  }),
});

export const autoCodec = t.type({
  balls: t.keyof({
    "0": null,
    "10": null,
    "20": null,
    "30": null,
    "40": null,
    "60": null,
    "80": null,
    "100": null,
    "120": null,
    "140": null,
    more: null,
  }),
  path: t.array(t.type({ point, time: t.number })),
});

export const defaultAuto: t.TypeOf<typeof autoCodec> = {
  path: [],
  balls: "0",
};

export const teleSection = t.union([
  t.type({ rating: t.union([t.number, t.undefined]), description: t.string }),
  t.undefined,
]);

export const teleCodec = t.type({
  driving: teleSection,
  defense: teleSection,
  evasion: teleSection,
});

export const defaultTele: t.TypeOf<typeof teleCodec> = {
  driving: undefined,
  defense: undefined,
  evasion: undefined,
};

export type AutoClimb = t.TypeOf<typeof autoClimbCodec>;
export type AutoClimbTime = t.TypeOf<typeof autoClimbTimeCodec>;
