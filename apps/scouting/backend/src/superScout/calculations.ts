//בס"ד

import {
  SuperMetricKey,
  SuperScout,
  TeamSuperScout,
  teamSuperScoutCodec,
  TeamSuperScoutNumbers,
} from "@repo/scouting_types";

const FIRST_TEAM = 0;
const SECOND_TEAM = 1;
const THIRD_TEAM = 2;

export const superScoutToTeamSuperScout = (
  superScoutForms: SuperScout[],
): TeamSuperScout[] => superScoutForms.flatMap((form) => form.teams);

export const teamSuperScoutKeys = Object.keys(teamSuperScoutCodec.props);

export const superMetricKeys = teamSuperScoutKeys.filter(
  (key): key is SuperMetricKey => key !== "teamNumber",
);

export const superScoutConvertToNumbers: (
  teamSuperForms: TeamSuperScout[],
) => TeamSuperScoutNumbers[] = (teamSuperForms) =>
  teamSuperForms.map(
    (form) =>
      ({
        teamNumber: form.teamNumber,
        ...Object.fromEntries(
          superMetricKeys.map((key) => [
            key,
            form[key].rating ? parseInt(form[key].rating) : 0,
          ]),
        ),
      }) as TeamSuperScoutNumbers,
  );

export const filterOneTeam: (
  allTeamForms: TeamSuperScout[],
  teamNumber: number,
) => TeamSuperScout[] = (allTeamForms, teamNumber) =>
  allTeamForms.filter((currentForm) => currentForm.teamNumber === teamNumber);

export const calcAvarageTeamSuperScout = (
  superForms: TeamSuperScoutNumbers[],
): TeamSuperScoutNumbers => {
  const teamNumber = superForms[0].teamNumber;
  const count = superForms.length;

  const averagedMetrics = Object.fromEntries(
    superMetricKeys.map((metric) => {
      const sum = superForms.reduce((acc, form) => acc + form[metric], 0);
      return [metric, sum / count];
    }),
  );

  return {
    teamNumber,
    ...averagedMetrics,
  } as TeamSuperScoutNumbers;
};

export const processAvarageTeamSuperScouting = (
  teamNumber: number,
  superScoutForms: SuperScout[],
) => {
  const teamSuperForms = superScoutToTeamSuperScout(superScoutForms);
  const oneTeamSuperForms = filterOneTeam(teamSuperForms, teamNumber);
  const numberedSuperForms = superScoutConvertToNumbers(oneTeamSuperForms);
  return calcAvarageTeamSuperScout(numberedSuperForms);
};
