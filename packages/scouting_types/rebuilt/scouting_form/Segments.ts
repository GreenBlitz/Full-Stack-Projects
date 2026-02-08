// בס"ד
import * as t from "io-ts";
import {
  defaultMovement,
  autoMovementCodec,
  teleMovementCodec,
} from "./Movement";
import {
  climbCodec,
  defaultAutoClimb,
  defaultClimb,
  defaultShift,
  levelTimeCodec,
  shiftCodec,
} from "./Shift";

const autoTypes = t.keyof({
  trenchFuelMiddle: null,
});

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

export const autoCodec = t.intersection([
  t.type({
    movement: autoMovementCodec,
    chosenAuto: autoTypes,
    climb: autoClimbCodec,
  }),
  shiftCodec,
]);

export const defaultAuto: t.TypeOf<typeof autoCodec> = {
  movement: defaultMovement,
  chosenAuto: "trenchFuelMiddle",
  climb: defaultAutoClimb,
  ...defaultShift,
};

export const teleCodec = t.type({
  transitionShift: shiftCodec,
  shifts: t.tuple([shiftCodec, shiftCodec, shiftCodec, shiftCodec]),
  endgameShift: shiftCodec,
  movement: teleMovementCodec,
  climb: climbCodec,
});

export const defaultTele: t.TypeOf<typeof teleCodec> = {
  transitionShift: defaultShift,
  shifts: [defaultShift, defaultShift, defaultShift, defaultShift],
  endgameShift: defaultShift,
  movement: { bumpStuck: false },
  climb: defaultClimb,
};

export type AutoClimb = t.TypeOf<typeof autoClimbCodec>;
export type AutoClimbTime = t.TypeOf<typeof autoClimbTimeCodec>;
