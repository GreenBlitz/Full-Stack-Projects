// בס"ד

export const targetTeamNumber = 4590;
export const backendPort = 4590;

export const refreshIntervalMs = 30000;
export const timeMultiplier = 1000;

export const sliceStart = 3;
export const firstIndex = 0;
export const nextMatchLimit = 2;
export const noGap = 0;

export const matchTimeDefault = 0;
export const matchTimeMissing = 0;
export const dayInSeconds = 86400;

export const sortABeforeB = -1;
export const sortBBeforeA = 1;

export const weightQm = 1;
export const weightEf = 2;
export const weightQf = 3;
export const weightSf = 4;
export const weightF = 5;
export const weightDefault = 99;
export const defaultLevelWeight = 1;
export const levelWeights = {
  1: weightQm,
  2: weightEf,
  3: weightQf,
  4: weightSf,
  5: weightF,
};
export const targetTeamKey = `frc${targetTeamNumber}`;
export const backendBaseUrl = `http://localhost:${backendPort}/fetch?url=`;
export const notFoundIndex = -1;
