// בס"ד

import type { Dispatch, FC } from "react";
import type { ScoutingForm } from "@repo/scouting_types";

type Movement = ScoutingForm["tele"]["movement"];

interface MovementFormProps {
  setMovement: Dispatch<Movement>;
  currentMovement: Movement;
}

export const MovementForm: FC<MovementFormProps> = ({
  setMovement,
  currentMovement,
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-yellow-500" />
      <button
        className={`bg-${currentMovement.bumpStuck ? "yellow-500" : "slate-800"} m-1 w-32 h-16 px-2`}
        onClick={() => {
          setMovement({
            ...currentMovement,
            bumpStuck: !currentMovement.bumpStuck,
          });
        }}
      >
        Stuck Bump
      </button>
    </div>
  );
};
