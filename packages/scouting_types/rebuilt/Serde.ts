// בס"ד
import {
  serdeEnumedString,
  serdeRecordFieldsBuilder,
  serdeString,
  serdeUnsignedInt,
} from "@repo/serde";
import type { ScoutingForm } from "./ScoutingForm";
import { FieldsRecordSerde, Serde } from "@repo/serde/types";

const MATCH_NUMBER_BIT_COUNT = 7;
const TEAM_NUMBER_BIT_COUNT = 14;

const serdeFields = {
  scouterName: serdeString(),
  matchNumber: serdeUnsignedInt(MATCH_NUMBER_BIT_COUNT),
  teamNumber: serdeUnsignedInt(TEAM_NUMBER_BIT_COUNT),
  matchType: serdeEnumedString(["qualification", "playoff", "practice"]),
  comment: serdeString(),
  auto: 
  
} satisfies Record<keyof ScoutingForm, unknown>;

export const scoutingFormSerde = serdeRecordFieldsBuilder();
