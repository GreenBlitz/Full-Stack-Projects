//בס"ד

import type { Dispatch, FC, SetStateAction } from "react";
import { ClimbInput } from "../components/ClimbInput";
import type { Alliance, Climb, ScoutingForm } from "@repo/scouting_types";

export interface ClimbSectionProps {
  setForm: Dispatch<SetStateAction<ScoutingForm>>;
  originTime: number;
  currentForm: ScoutingForm;
  isAuto: boolean;
  onBack: () => void;
  name: string;
  alliance: Alliance;
}

export const ClimbSection: FC<ClimbSectionProps> = ({
  setForm,
  originTime,
  currentForm,
  isAuto,
  name,
  onBack,
  alliance,
}) => {
  return <></>;
};
