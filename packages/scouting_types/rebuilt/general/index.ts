// בס"ד

import type { GamePhase } from "../../teams";
import type { FuelObject } from "../fuel";
import type { ClimbLevel } from "../scouting_form";

interface GeneralPhasedData {
  fuel: FuelObject;
  climb: { maxLevel: ClimbLevel; averageScore: number };
}

export type GeneralData = Record<GamePhase, GeneralPhasedData>;
