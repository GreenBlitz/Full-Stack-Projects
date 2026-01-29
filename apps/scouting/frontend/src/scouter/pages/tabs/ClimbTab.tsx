//בס"ד

import type { FC } from "react";
import type { TabProps } from "../ScoutMatch";
import { ClimbInput } from "../../components/ClimbInput";
import type { ScoutingForm } from "@repo/scouting_types";

interface ClimbTabProps extends TabProps {}

export const ClimbTab: FC<ClimbTabProps> = ({
  setForm,
  originTime,
  currentForm,
}) => {
  const updateClimbForm = (updates: ScoutingForm["auto" | "tele"]["climb"]) => {
    const phase = "L2" in updates.climbTime ? "tele" : "auto";

    const newForm = {
      ...currentForm,
      [phase]: {
        ...currentForm[phase],
        climb: {
          ...currentForm[phase].climb,
          ...updates,
        },
      },
    };

    setForm(newForm);
  };

  return (
    <div className="flex flex-row h-full w-full">
      <ClimbInput
        isAuto={false}
        originTime={originTime}
        updateClimbForm={updateClimbForm}
        currentForm={currentForm}
      />
    </div>
  );
};
