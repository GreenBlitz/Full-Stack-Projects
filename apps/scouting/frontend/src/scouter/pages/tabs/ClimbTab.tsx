//בס"ד

import type { FC } from "react";
import type { TabProps } from "../ScoutMatch";
import { ClimbInput } from "../../components/ClimbInput";
import type { Climb } from "@repo/scouting_types";

export interface ClimbTabProps extends TabProps{
  isAuto: boolean;
}

export const ClimbTab: FC<ClimbTabProps> = ({
  setForm,
  originTime,
  currentForm,
  isAuto,
}) => {
  const updateClimbForm = (updates: Climb) => {
    const phase = "L2" in updates.climbTime ? "tele" : "auto";

    setForm((prevForm) => ({
      ...prevForm,
      [phase]: {
        ...prevForm[phase],
        climb: {
          ...prevForm[phase].climb,
          ...updates,
        },
      },
    }));
  };

  return (
    <div className="flex flex-row h-full w-full">
      <ClimbInput
        isAuto={isAuto}
        originTime={originTime}
        updateClimbForm={updateClimbForm}
        currentForm={currentForm}
      />
    </div>
  );
};
