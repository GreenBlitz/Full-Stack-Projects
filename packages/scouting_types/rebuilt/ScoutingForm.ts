// בס"ד
import * as t from "io-ts";
import { shootEventCodec } from "./ShootEvent";
import { intervalCodec } from "./Interval";

const matchType = t.keyof({
  practice: null,
  qualification: null,
  playoff: null,
});

const autoTypes = t.keyof({
  trenchFuelMiddle: null,
});

const movementCodec = t.type({
  trenchPass: t.boolean,
  bumpPass: t.boolean,
  bumpStuck: t.boolean,
});

const shiftCodec = t.type({
  shootEvents: t.array(shootEventCodec),
});

const climbCodec = t.type({
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

export const scoutingFormCodec = t.type({
  scouterName: t.string,
  matchNumber: t.number,
  matchType,
  teamNumber: t.number,
  auto: t.intersection([
    t.type({
      movement: movementCodec,
      chosenAuto: autoTypes,
      climb: climbCodec,
    }),
    shiftCodec,
  ]),
  tele: t.type({
    transitionShift: shiftCodec,
    shifts: t.tuple([shiftCodec, shiftCodec, shiftCodec, shiftCodec]),
    endgameShift: shiftCodec,
    movement: movementCodec,
    climb: climbCodec,
  }),
  comment: t.string,
});

export type ScoutingForm = t.TypeOf<typeof scoutingFormCodec>;
