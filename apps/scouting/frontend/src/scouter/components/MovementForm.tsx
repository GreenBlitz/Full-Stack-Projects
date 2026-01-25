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
      <div className="bg-green-500" />
      <button
        className={`bg-${currentMovement.bumpPass ? "green-500" : "slate-800"} m-1 w-32 h-11 px-2`}
        onClick={() => {
          setMovement({
            ...currentMovement,
            bumpPass: !currentMovement.bumpPass,
          });
        }}
      >
        Over Bump
      </button>
      <button
        className={`bg-${currentMovement.bumpStuck ? "green-500" : "slate-800"} m-1 w-32 h-11 px-2`}
        onClick={() => {
          setMovement({
            ...currentMovement,
            bumpStuck: !currentMovement.bumpStuck,
          });
        }}
      >
        Stuck Bump
      </button>
      <button
        className={`bg-${currentMovement.trenchPass ? "green-500" : "slate-800"} m-1 w-32 h-11 px-2`}
        onClick={() => {
          setMovement({
            ...currentMovement,
            trenchPass: !currentMovement.trenchPass,
          });
        }}
      >
        Over Trench
      </button>
    </div>
  );
};
