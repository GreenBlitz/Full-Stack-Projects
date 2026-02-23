//בס"ד

import type { Dispatch, FC, SetStateAction } from "react";
import { ClimbInput } from "../../components/ClimbInput";
import type { Climb, ScoutingForm } from "@repo/scouting_types";

export interface ClimbTabProps {
  setForm: Dispatch<SetStateAction<ScoutingForm>>;
  originTime: number;
  currentForm: ScoutingForm;
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
