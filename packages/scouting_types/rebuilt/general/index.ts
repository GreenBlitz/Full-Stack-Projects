import { FuelObject } from "../fuel";
import { ClimbLevel } from "../scouting_form";

export interface GeneralFuelData {
  fullGame: FuelObject;
  auto: FuelObject;
  tele: FuelObject;
}

export interface GeneralClimbData {
  fullGame: number;
  auto: number;
  tele: number;
  highestClimbLevel: ClimbLevel;
}

interface GeneralMovementData {
  passTrenchCount: number;
  passBumpCount: number;
  stuckBumpCount: number;
}

export interface GeneralData {
  teamNumber: number;
  fuelData: GeneralFuelData;
  avarageClimbPoints: GeneralClimbData;
  movement: GeneralMovementData;
  opr: number;
  epa: number;
  averagePointsPerMatch: number;
}

