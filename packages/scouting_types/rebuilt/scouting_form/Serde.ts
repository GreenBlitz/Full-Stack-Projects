// בס"ד
import {
  createRecordSerde,
  serdeArray,
  serdeBool,
  serdeEnumedString,
  serdeOptional,
  serdeOptionalNull,
  serdeString,
  serdeUnsignedInt,
} from "@repo/serde";

import type { Match, ScoutingForm } from "./ScoutingForm";
import type { Serde } from "../../../serde/types";
import type { Interval } from "./Interval";
import type { Point, ShootEvent } from "./ShootEvent";
import type { AutoClimb, defaultAuto, defaultTele } from "./Segments";
import type { TeleClimb } from "./Shift";
import { competitions } from "./GameData";

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

const serdeMovement = createRecordSerde({
  bumpStuck: serdeBool(),
});

const serdeTele = createRecordSerde<typeof defaultTele>({
  transitionShift: serdeMovement,
  shifts: serdeArray(serdeMovement) as any, //shifts requires 4 and this is how to fix that
  endgameShift: serdeMovement,
  climb: serdeClimbTele,
});

export const serdeAuto = createRecordSerde<typeof defaultAuto>({
  climb: serdeClimbAuto,
  path: serdeArray(
    createRecordSerde({
      point: serdePoint,
      time: serdeUnsignedInt(TIME_MILLISECONDS_BIT_COUNT),
    }),
  ),
});

const serdeNoShow: Serde<boolean> = {
  serializer(serializedData, value: boolean) {
    serdeOptional(serdeBool()).serializer(serializedData, value);
  },
  deserializer(serializedData) {
    return serdeOptional(serdeBool()).deserializer(serializedData) ?? false;
  },
};

const serdeFields = {
  scouterName: serdeString(),
  competition: serdeEnumedString(competitions),
  match: createRecordSerde<Match>({
    number: serdeUnsignedInt(MATCH_NUMBER_BIT_COUNT),
    type: serdeEnumedString(["playoff", "qualification", "practice"]),
  }),
  teamNumber: serdeUnsignedInt(TEAM_NUMBER_BIT_COUNT),
  comment: serdeString(),
  auto: serdeAuto,
  tele: serdeTele,
  robotBroken: serdeBool(),
  noShow: serdeNoShow,
} satisfies Record<keyof ScoutingForm, unknown>;

export const scoutingFormSerde = createRecordSerde(serdeFields);
