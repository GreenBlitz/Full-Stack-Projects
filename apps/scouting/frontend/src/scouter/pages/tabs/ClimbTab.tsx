//בס"ד

import type { FC } from "react";
import type { TabProps } from "../ScoutMatch";
import { ClimbInput } from "../../components/ClimbInput";
import type {
  AutoClimbTime,
  ClimbLevel,
  ClimbSide,
  ClimbTime,
} from "@repo/scouting_types";

interface ClimbTabProps extends TabProps {}

export const ClimbTab: FC<ClimbTabProps> = ({ setForm, originTime }) => {
  return (
    <div className="flex flex-row h-full w-full">
      <ClimbInput
        isAuto={false}
        submitClimbSides={(inputClimbSides: ClimbSide, isAuto: boolean) => {
          setForm((prev) => {
            const phase = isAuto ? "auto" : "tele";
            const currentPhaseData = prev[phase];

            return {
              ...prev,
              [phase]: {
                ...currentPhaseData,
                climb: {
                  ...currentPhaseData.climb,
                  climbSide: inputClimbSides,
                },
              },
            };
          });
        }}
        submitClimbLevelAndTime={(
          inputClimbLevel: ClimbLevel,
          inputClimbTime: ClimbTime | AutoClimbTime,
          isAuto: boolean,
        ) => {
          const phase = isAuto ? "auto" : "tele";

          setForm((prevForm) => {
            const currentPhaseData = prevForm[phase];

            return {
              ...prevForm,
              [phase]: {
                ...currentPhaseData,
                climb: {
                  ...currentPhaseData.climb,
                  climbTime: inputClimbTime,
                  level: inputClimbLevel,
                },
              },
            };
          });
        }}
        originTime={originTime}
      />
    </div>
  );
};
