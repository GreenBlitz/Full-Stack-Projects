// בס"ד
import * as t from "io-ts";
import {
  defaultMovement,
  teleMovementCodec,
} from "./Movement";
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
  climb: autoClimbCodec,
  path: t.array(t.type({ point, time: t.number })),
});

export const defaultAuto: t.TypeOf<typeof autoCodec> = {
  climb: defaultAutoClimb,
  path: [],
};

export const teleCodec = t.type({
  transitionShift: teleMovementCodec,
  shifts: t.tuple([
    teleMovementCodec,
    teleMovementCodec,
    teleMovementCodec,
    teleMovementCodec,
  ]),
  endgameShift: teleMovementCodec,
  climb: climbCodec,
});

export const defaultTele: t.TypeOf<typeof teleCodec> = {
  transitionShift: defaultMovement,
  shifts: [defaultMovement, defaultMovement, defaultMovement, defaultMovement],
  endgameShift: defaultMovement,
  climb: defaultClimb,
};

export type AutoClimb = t.TypeOf<typeof autoClimbCodec>;
export type AutoClimbTime = t.TypeOf<typeof autoClimbTimeCodec>;
