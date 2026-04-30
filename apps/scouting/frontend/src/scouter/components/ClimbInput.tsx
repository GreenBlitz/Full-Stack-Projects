//בס"ד
import type React from "react";
import { useState } from "react";
import { ClimbLevelSlider } from "./ClimbLevelSlider";
import type {
  AutoClimb,
  AutoClimbTime,
  Climb,
  TeleClimbLevel,
  TeleClimbSide,
  TeleClimbTime,
  ScoutingForm,
  Alliance,
} from "@repo/scouting_types";
import { ClimbSideButton } from "./ClimbSideButton";

interface InputClimbProps {
  isAuto: boolean;
  updateClimbForm: (updates: Climb) => void;
  originTime: number;
  currentForm: ScoutingForm;
  alliance: Alliance;
}

export const ClimbInput: React.FC<InputClimbProps> = ({
  isAuto,
  updateClimbForm,
  originTime,
  currentForm,
  alliance,
}) => {
  return <></>;
};
