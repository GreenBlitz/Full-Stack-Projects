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
    <div className="flex flex-wrap items-center">
      <div className="bg-green-700" />
      <div className="flex flex-row mx-auto">
        <button
          className={`bg-${currentMovement.bumpPass ? "green-700" : "slate-800"} m-1 w-16 px-2`}
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
          className={`bg-${currentMovement.trenchPass ? "green-700" : "slate-800"} m-1 w-16 px-2`}
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
      <div className="mx-auto">
        <button
          className={`bg-${currentMovement.bumpStuck ? "green-700" : "slate-800"} m-1 w-16 px-2`}
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
    </div>
  );
};
