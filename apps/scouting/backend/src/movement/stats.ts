//בס"ד

import { calculateSum } from "@repo/array-functions";
import type { ScoutingForm } from "@repo/scouting_types";


export const findTimesStuckOnBump = (forms: ScoutingForm[]) => {
  return calculateSum(forms, (form) => Number(!form.tele.movement.bumpStuck));
};
