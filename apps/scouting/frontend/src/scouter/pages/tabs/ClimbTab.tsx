//בס"ד

import type { Dispatch, FC, SetStateAction } from "react";
import { ClimbInput } from "../../components/ClimbInput";
import type { Alliance, Climb, ScoutingForm } from "@repo/scouting_types";

export interface ClimbTabProps {
  setForm: Dispatch<SetStateAction<ScoutingForm>>;
  originTime: number;
  currentForm: ScoutingForm;
  isAuto: boolean;
  onBack: () => void;
  name: string;
  alliance: Alliance;
}

export const ClimbTab: FC<ClimbTabProps> = ({
  setForm,
  originTime,
  currentForm,
  isAuto,
  name,
  onBack,
  alliance,
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

  const backButton = (
    <button
      className={`h-full w-20 bg-${alliance}-500 uppercase`}
      onClick={onBack}
    >
      {name}
    </button>
  );
  return (
    <div className="flex flex-row h-full w-full">
      {alliance === "blue" && backButton}
      <ClimbInput
        isAuto={isAuto}
        originTime={originTime}
        updateClimbForm={updateClimbForm}
        currentForm={currentForm}
        alliance={alliance}
      />
      {alliance === "red" && backButton}
    </div>
  );
};
