//בס"ד

import { calculateSum } from "@repo/array-functions";
import type {
  ScoutingForm,
  TeleClimbLevel,
  TimesClimedToLevels,
} from "@repo/scouting_types";

export const findMaxClimbLevel = (forms: ScoutingForm[]) => {
  const fullGameClimbedLevels = [
    ...forms.map((form) => form.tele.climb.level),
    ...forms.map((form) => form.auto.climb.level),
  ];

  return fullGameClimbedLevels.includes("L3")
    ? "L3"
    : fullGameClimbedLevels.includes("L2")
      ? "L2"
      : fullGameClimbedLevels.includes("L1")
        ? "L1"
        : "L0";
};

const INITIAL_COUNTER_VALUE = 0;
const INCREMENT = 1;

export const findTimesClimbedToLevel = (
  forms: ScoutingForm[],
  level: TeleClimbLevel,
) => {
  return calculateSum(forms, (form) =>
    form.tele.climb.level === level ? INCREMENT : INITIAL_COUNTER_VALUE,
  );
};

export const timesClimedToLevel = (
  level: TeleClimbLevel,
  climbedLevels: TeleClimbLevel[],
) => climbedLevels.filter((currentLevel) => currentLevel === level).length;

export const findTimesClimbedInAuto = (forms: ScoutingForm[]) => {
  return calculateSum(forms, (form) =>
    form.auto.climb.level === "L1" ? INCREMENT : INITIAL_COUNTER_VALUE,
  );
};

export const findTimesClimbedToLevels = (forms: ScoutingForm[]) => {
  const climbedLevels = forms.map((form) => form.tele.climb.level);
  const timeToLevels: TimesClimedToLevels = {
    L1: timesClimedToLevel("L1", climbedLevels),
    L2: timesClimedToLevel("L2", climbedLevels),
    L3: timesClimedToLevel("L3", climbedLevels),
  };
  return timeToLevels;
};
