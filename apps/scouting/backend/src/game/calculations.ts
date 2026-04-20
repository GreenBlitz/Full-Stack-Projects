//בס"ד

import { BPS, ScoutingForm } from "@repo/scouting_types";
import {
  AUTO_CLIMB_MULTIPLIER,
  calculateAverageClimbsScore,
  CLIMB_SCORE_VALUES,
  TELE_CLIMB_MULTIPLIER,
} from "../climb/score";
import { calculateAverage } from "@repo/array-functions";
import { calculateAverageScoredFuel } from "../fuel/fuel-general";

export const calculateTotalGamePoints = (forms: ScoutingForm[], bpses: BPS[]) =>
  calculateAverage(
    forms,
    (form) =>
      CLIMB_SCORE_VALUES[form.auto.climb.level] * AUTO_CLIMB_MULTIPLIER +
      CLIMB_SCORE_VALUES[form.tele.climb.level] * TELE_CLIMB_MULTIPLIER +
      calculateAverageScoredFuel(forms, "fullGame", bpses),
    //Dror: 67676767676767676767676766767676767676767676767676767676767676767676767676767676767677666676766776767676767676767676767
  );
