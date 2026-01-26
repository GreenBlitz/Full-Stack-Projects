//בס"ד

import type { FC } from "react";
import type { TabProps } from "../ScoutMatch";
import { ClimbInput } from "../../components/ClimbInput";
import type {
  AutoClimbTime,
  Climb,
  ClimbLevel,
  ClimbSide,
  ClimbTime,
} from "@repo/scouting_types";

interface ClimbTabProps extends TabProps {}

export const ClimbTab: FC<ClimbTabProps> = ({ setForm, originTime }) => {

const updateClimbForm = (updates: Partial<Climb>, isAuto: boolean) => {
  const phase = isAuto ? "auto" : "tele";

  setForm((prev) => ({
    ...prev,
    [phase]: {
      ...prev[phase],
      climb: {
        ...prev[phase].climb,
        ...updates,
      },
    },
  }));
};

  return (
    <div className="flex flex-row h-full w-full">
      <ClimbInput
        isAuto={false}

        originTime={originTime} updateClimbForm={updateClimbForm}/>
    </div>
  );
};
