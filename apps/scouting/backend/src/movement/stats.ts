//בס"ד

import { calculateSum } from "@repo/array-functions";
import type { ScoutingForm } from "@repo/scouting_types";
import { MovementEvent } from "@repo/scouting_types/rebuilt/Movement";

export const findTimesMovementEvent = (
  forms: ScoutingForm[],
  event: MovementEvent,
) => {
  return calculateSum(forms, (form) =>
    Number(form.auto.movement[event]) + form.tele.movement[event]
      ? Number(form.tele.movement[event])
      : 0,
  );
};
