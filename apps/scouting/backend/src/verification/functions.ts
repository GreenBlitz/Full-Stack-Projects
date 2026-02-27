//בס"ד

import { firstElement, isEmpty } from "@repo/array-functions";
import type { ScoutingForm } from "@repo/scouting_types";

export const isSingleTeam = (forms: ScoutingForm[]): boolean => {
  if (isEmpty(forms)) return true;

  const firstTeam = firstElement(forms).teamNumber;
  return forms.every((form) => form.teamNumber === firstTeam);
};

export const isSingleCompetition = (forms: ScoutingForm[]): boolean => {
  if (isEmpty(forms)) return true;

  const firstComp = firstElement(forms).competition;
  return forms.every((form) => form.competition === firstComp);
};
