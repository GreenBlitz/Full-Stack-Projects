//בס"ד

import type { FC } from "react";
import type { TabProps } from "../ScoutMatch";
import { ClimbInput } from "../../components/ClimbInput";
import type { ScoutingForm } from "@repo/scouting_types";

export type Climb = ScoutingForm["auto" | "tele"]["climb"];

export const ClimbTab: FC<TabProps> = ({
  setForm,
  originTime,
  currentForm,
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
        isAuto={false}
        originTime={originTime}
        updateClimbForm={updateClimbForm}
        currentForm={currentForm}
      />
    </div>
  );
};
