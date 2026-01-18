// בס"ד
import * as t from "io-ts";
import { movementCodec } from "./Movement";
import { climbCodec, shiftCodec } from "./Shift";

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

export const teleCodec = t.type({
  transitionShift: shiftCodec,
  shifts: t.tuple([shiftCodec, shiftCodec, shiftCodec, shiftCodec]),
  endgameShift: shiftCodec,
  movement: movementCodec,
  climb: climbCodec,
});
