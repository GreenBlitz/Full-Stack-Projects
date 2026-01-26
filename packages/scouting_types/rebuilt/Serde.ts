// בס"ד
import {
  createRecordSerde,
  serdeArray,
  serdeBool,
  serdeEnumedString,
  serdeOptionalNull,
  serdeString,
  serdeUnsignedInt,
} from "@repo/serde";
import type { ScoutingForm } from "./ScoutingForm";
import type { Interval } from "./Interval";
import type { Point, ShootEvent } from "./ShootEvent";
import type { defaultAuto, defaultTele } from "./Segments";
import type { Climb } from "./Shift";

const MATCH_NUMBER_BIT_COUNT = 7;
const TEAM_NUMBER_BIT_COUNT = 14;

const TIME_MILLISECONDS_BIT_COUNT = 18;

const intervalSerde = createRecordSerde<Interval>({
  start: serdeUnsignedInt(TIME_MILLISECONDS_BIT_COUNT),
  end: serdeUnsignedInt(TIME_MILLISECONDS_BIT_COUNT),
});

const COORDINATE_BIT_COUNT = 11;
const pointSerde = createRecordSerde<Point>({
  x: serdeUnsignedInt(COORDINATE_BIT_COUNT),
  y: serdeUnsignedInt(COORDINATE_BIT_COUNT),
});

const shootEventsSerde = serdeArray(
  createRecordSerde<ShootEvent>({
    interval: intervalSerde,
    startPosition: pointSerde,
  }),
);

const shiftSerde = createRecordSerde({
  shootEvents: shootEventsSerde,
});

const climbSerde = createRecordSerde<Climb>({
  climbTime: createRecordSerde({
    L1: serdeOptionalNull(intervalSerde),
    L2: serdeOptionalNull(intervalSerde),
    L3: serdeOptionalNull(intervalSerde),
  }),
  climbSide: serdeEnumedString(["none", "middle", "side", "support"]),
  level: serdeEnumedString(["L0", "L1", "L2", "L3"]),
});

const serdeFields = {
  scouterName: serdeString(),
  matchNumber: serdeUnsignedInt(MATCH_NUMBER_BIT_COUNT),
  teamNumber: serdeUnsignedInt(TEAM_NUMBER_BIT_COUNT),
  matchType: serdeEnumedString(["qualification", "playoff", "practice"]),
  comment: serdeString(),
  auto: createRecordSerde<typeof defaultAuto>({
    shootEvents: shootEventsSerde,
    chosenAuto: serdeEnumedString(["trenchFuelMiddle"]),
    movement: createRecordSerde({
      trenchPass: serdeBool(),
      bumpPass: serdeBool(),
      bumpStuck: serdeBool(),
    }),
    climb: climbSerde,
  }),
  tele: createRecordSerde<typeof defaultTele>({
    transitionShift: shiftSerde,
    shifts: serdeArray(shiftSerde) as any, //will fix later
    endgameShift: shiftSerde,
    movement: createRecordSerde({
      bumpStuck: serdeBool(),
    }),
    climb: climbSerde,
  }),
} satisfies Record<keyof ScoutingForm, unknown>;

export const scoutingFormSerde = createRecordSerde(serdeFields);
