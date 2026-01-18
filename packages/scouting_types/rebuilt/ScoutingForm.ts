// בס"ד
import * as t from "io-ts";
import { shootEventCodec } from "./ShootEvent";
import { intervalCodec } from "./Interval";

const matchType = t.keyof({
  Practice: null,
  Qualification: null,
  Playoff: null,
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
  events: t.array(shootEventCodec),
});

const climbCodec = t.type({
  interval: intervalCodec,
  climbSide: t.boolean,
  level: t.keyof({
    None: null,
    L1: null,
    L2: null,
    L3: null,
  }),
});

export const scoutingFormCodec = t.type({
  scouterName: t.string,
  matchNumber: t.number,
  matchType,
  auto: t.intersection([
    t.type({
      movement: movementCodec,
      chosenAuto: autoTypes,
    }),
    shiftCodec,
  ]),
  tele: t.type({
    shifts: t.tuple([
      shiftCodec,
      shiftCodec,
      shiftCodec,
      shiftCodec,
      shiftCodec,
    ]),
    endgameShift: shiftCodec,
    movement: movementCodec,
    climb: climbCodec,
  }),
  comment: t.string,
});

export type ScoutingForm = t.TypeOf<typeof scoutingFormCodec>;
