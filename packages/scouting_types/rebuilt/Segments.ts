// בס"ד
import * as t from "io-ts";
import { defaultMovement, movementCodec } from "./Movement";
import { climbCodec, defaultClimb, defaultShift, shiftCodec } from "./Shift";

const autoTypes = t.keyof({
  trenchFuelMiddle: null,
});

export const autoCodec = t.intersection([
  t.type({
    movement: movementCodec,
    chosenAuto: autoTypes,
    climb: climbCodec,
  }),
  shiftCodec,
]);

export const defaultAuto: t.TypeOf<typeof autoCodec> = {
  movement: defaultMovement,
  chosenAuto: "trenchFuelMiddle",
  climb: defaultClimb,
  ...defaultShift,
};

export const teleCodec = t.type({
  transitionShift: shiftCodec,
  shifts: t.tuple([shiftCodec, shiftCodec, shiftCodec, shiftCodec]),
  endgameShift: shiftCodec,
  movement: movementCodec,
  climb: climbCodec,
});

export const defaultTele: t.TypeOf<typeof teleCodec> = {
  transitionShift: defaultShift,
  shifts: [defaultShift,defaultShift,defaultShift,defaultShift],
  endgameShift: defaultShift,
  movement: defaultMovement,
  climb: defaultClimb
}
