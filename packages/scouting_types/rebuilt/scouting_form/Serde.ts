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
import type { Match, ScoutingForm } from "./ScoutingForm";
import type { Interval } from "./Interval";
import type { Point, ShootEvent } from "./ShootEvent";
import type { AutoClimb, defaultAuto, defaultTele } from "./Segments";
import type { TeleClimb } from "./Shift";
import { competitionKeys } from "./GameData";

const MATCH_NUMBER_BIT_COUNT = 7;
const TEAM_NUMBER_BIT_COUNT = 14;

const TIME_MILLISECONDS_BIT_COUNT = 18;

const serdeInterval = createRecordSerde<Interval>({
  start: serdeUnsignedInt(TIME_MILLISECONDS_BIT_COUNT),
  end: serdeUnsignedInt(TIME_MILLISECONDS_BIT_COUNT),
});

const COORDINATE_BIT_COUNT = 11;
const serdePoint = createRecordSerde<Point>({
  x: serdeUnsignedInt(COORDINATE_BIT_COUNT),
  y: serdeUnsignedInt(COORDINATE_BIT_COUNT),
});

const serdeShootEvents = serdeArray(
  createRecordSerde<ShootEvent>({
    interval: serdeInterval,
    startPosition: serdePoint,
  }),
);

const serdeShift = createRecordSerde({
  shootEvents: serdeShootEvents,
});

const serdeClimbTele = createRecordSerde<TeleClimb>({
  climbTime: createRecordSerde({
    L1: serdeOptionalNull(serdeInterval),
    L2: serdeOptionalNull(serdeInterval),
    L3: serdeOptionalNull(serdeInterval),
  }),
  climbSide: createRecordSerde({
    middle: serdeBool(),
    side: serdeBool(),
    support: serdeBool(),
  }),
  level: serdeEnumedString(["L0", "L1", "L2", "L3"]),
});

const serdeClimbAuto = createRecordSerde<AutoClimb>({
  climbTime: createRecordSerde({
    L1: serdeOptionalNull(serdeInterval),
  }),
  climbSide: createRecordSerde({
    middle: serdeBool(),
    side: serdeBool(),
    support: serdeBool(),
  }),
  level: serdeEnumedString(["L0", "L1"]),
});

const serdeTele = createRecordSerde<typeof defaultTele>({
  transitionShift: serdeShift,
  shifts: serdeArray(serdeShift) as any, //shifts requires 4 and this is how to fix that
  endgameShift: serdeShift,
  movement: createRecordSerde({
    bumpStuck: serdeBool(),
  }),
  climb: serdeClimbTele,
});

export const serdeAuto = createRecordSerde<typeof defaultAuto>({
  shootEvents: serdeShootEvents,
  chosenAuto: serdeEnumedString(["trenchFuelMiddle"]),
  movement: createRecordSerde({
    trenchPass: serdeBool(),
    bumpPass: serdeBool(),
    bumpStuck: serdeBool(),
  }),
  climb: serdeClimbAuto,
});

const serdeFields = {
  scouterName: serdeString(),
  competition: serdeEnumedString(competitionKeys),
  match: createRecordSerde<Match>({
    number: serdeUnsignedInt(MATCH_NUMBER_BIT_COUNT),
    type: serdeEnumedString(["playoff", "qualification", "practice"]),
  }),
  teamNumber: serdeUnsignedInt(TEAM_NUMBER_BIT_COUNT),
  comment: serdeString(),
  auto: serdeAuto,
  tele: serdeTele,
} satisfies Record<keyof ScoutingForm, unknown>;

export const scoutingFormSerde = createRecordSerde(serdeFields);
