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

export const COMP_LEVEL_WEIGHTS: Record<string, number> = {
  qm: 1,
  ef: 2,
  qf: 3,
  sf: 4,
  f: 5,
  default: 99,
};

export const DEFAULT_LEVEL_WEIGHT = 1;
export const targetTeamKey = `frc${targetTeamNumber}`;
export const backendBaseUrl = `http://localhost:${backendPort}/api/v1/tba`;
export const notFoundIndex = -1;
