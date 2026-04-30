// בס"ד
import { useState, type FC } from "react";
import type { TabProps } from "../ScoutMatch";
import type { ScoutingForm, ShiftType } from "@repo/scouting_types";
import { MovementForm } from "../../components/MovementForm";
import { ClimbSection } from "../../components/ClimbSection";

interface ShiftTabProps extends TabProps {
  tabIndex: number;
  shiftType: ShiftType;
}

export const ShiftTab: FC<ShiftTabProps> = ({
  setForm,
  tabIndex,
  shiftType,
  alliance,
  originTime,
  currentForm,
}) => {
  return <></>;
};
