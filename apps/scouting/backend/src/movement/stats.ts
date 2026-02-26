//בס"ד

import { calculateSum } from "@repo/array-functions";
import type { ScoutingForm } from "@repo/scouting_types";

const INITIAL_COUNTER_VALUE = 0;
const INCREMENT = 1;
export const findTimesStuckOnBump = (forms: ScoutingForm[]) => {
  return calculateSum(forms, (form) => Number(!form.tele.movement.bumpStuck));
};
