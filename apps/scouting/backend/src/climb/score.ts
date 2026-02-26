//בס"ד

import { calculateAverage } from "@repo/array-functions";
import type { ClimbLevel, ScoutingForm } from "@repo/scouting_types";

export const CLIMB_SCORE_VALUES = { L0: 0, L1: 10, L2: 20, L3: 30 };

const TELE_CLIMB_MULTIPLIER = 1;
const AUTO_CLIMB_MULTIPLIER = 1.5;
export const calculateAverageClimbScore = (
  climbs: ClimbLevel[],
  isAuto: boolean,
) =>
  calculateAverage(
    climbs,
    (climb) =>
      CLIMB_SCORE_VALUES[climb] *
      (isAuto ? AUTO_CLIMB_MULTIPLIER : TELE_CLIMB_MULTIPLIER),
  );

export const calculateAverageClimbsScore = (forms: ScoutingForm[]) => ({
  auto: calculateAverageClimbScore(
    forms.map((form) => form.auto.climb.level),
    true,
  ),
  tele: calculateAverageClimbScore(
    forms.map((form) => form.tele.climb.level),
    false,
  ),
});
