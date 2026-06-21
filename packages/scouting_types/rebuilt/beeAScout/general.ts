export interface GeneralBeePhaseData {
  fuelScored: number;
  fuelPassed: number;
  climbPoints: number;
}

export interface GeneralTeamBeeData {
  auto: GeneralBeePhaseData;
  tele: GeneralBeePhaseData;
  full: GeneralBeePhaseData;
  super: {
    driving: number;
    defense: number;
    evasion: number;
  };
}

export type GeneralBeeData = Record<string,GeneralTeamBeeData>;
