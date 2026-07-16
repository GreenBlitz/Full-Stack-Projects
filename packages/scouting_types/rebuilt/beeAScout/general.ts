export interface GeneralBeePhaseData {
  fuelScored: number;
  fuelPassed: number;
  climbPoints: number;
}

export interface GeneralTeamBeeData {
  team: string;
  auto: GeneralBeePhaseData;
  tele: GeneralBeePhaseData;
  full: GeneralBeePhaseData;
  super: {
    driving: number;
    defenseRating: number;
    timesDefended: number;
    evasionRating: number;
    timesEvaded: number;
  };
  timesPlayed: number;
  timesStole: number;
}

export type GeneralBeeData = Record<string, GeneralTeamBeeData>;
