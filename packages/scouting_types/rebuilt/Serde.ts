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
import type { Serde } from "@repo/serde/types";

const MATCH_NUMBER_BIT_COUNT = 7;
const TEAM_NUMBER_BIT_COUNT = 14;

const TIME_MILLISECONDS_BIT_COUNT = 18;

const serdeInterval = () =>
  createRecordSerde<Interval>({
    start: serdeUnsignedInt(TIME_MILLISECONDS_BIT_COUNT),
    end: serdeUnsignedInt(TIME_MILLISECONDS_BIT_COUNT),
  });

const COORDINATE_BIT_COUNT = 11;
const serdePoint = () =>
  createRecordSerde<Point>({
    x: serdeUnsignedInt(COORDINATE_BIT_COUNT),
    y: serdeUnsignedInt(COORDINATE_BIT_COUNT),
  });

const serdeShootEvents = () =>
  serdeArray(
    createRecordSerde<ShootEvent>({
      interval: serdeInterval(),
      startPosition: serdePoint(),
    }),
  );

const serdeShift = () =>
  createRecordSerde({
    shootEvents: serdeShootEvents(),
  });

const serdeClimb = () =>
  createRecordSerde<Climb>({
    climbTime: createRecordSerde({
      L1: serdeOptionalNull(serdeInterval()),
      L2: serdeOptionalNull(serdeInterval()),
      L3: serdeOptionalNull(serdeInterval()),
    }),
    climbSide: serdeEnumedString(["none", "middle", "side", "support"]),
    level: serdeEnumedString(["L0", "L1", "L2", "L3"]),
  });

const serdeTele = () =>
  createRecordSerde<typeof defaultTele>({
    transitionShift: serdeShift(),
    shifts: serdeArray(serdeShift()) as any, //will fix later
    endgameShift: serdeShift(),
    movement: createRecordSerde({
      bumpStuck: serdeBool(),
    }),
    climb: serdeClimb(),
  });

export const serdeAuto = () =>
  createRecordSerde<typeof defaultAuto>({
    shootEvents: serdeShootEvents(),
    chosenAuto: serdeEnumedString(["trenchFuelMiddle"]),
    movement: createRecordSerde({
      trenchPass: serdeBool(),
      bumpPass: serdeBool(),
      bumpStuck: serdeBool(),
    }),
    climb: serdeClimb(),
  });

const serdeFields = {
  scouterName: serdeString(),
  matchNumber: serdeUnsignedInt(MATCH_NUMBER_BIT_COUNT),
  teamNumber: serdeUnsignedInt(TEAM_NUMBER_BIT_COUNT),
  matchType: serdeEnumedString(["qualification", "playoff", "practice"]),
  comment: serdeString(),
  auto: serdeAuto(),
  tele: serdeTele(),
} satisfies Record<keyof ScoutingForm, unknown>;

export const scoutingFormSerde: Serde<ScoutingForm> =
  createRecordSerde(serdeFields);
