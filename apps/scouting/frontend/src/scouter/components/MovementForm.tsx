// בס"ד

import type { Dispatch, FC } from "react";
import type { Movement } from "@repo/scouting_types";

interface MovementFormProps {
  setMovement: Dispatch<Movement>;
  currentMovement: Movement;
}

export const MovementForm: FC<MovementFormProps> = ({
  setMovement,
  currentMovement,
}) => {
  return (
    <div className="flex flex-col items-center gap-1 shrink-0">
      {"trenchPass" in currentMovement && (
        <>
          <button
            className={`bg-${currentMovement.trenchPass ? "rose-500" : "slate-800"} w-32 h-8 sm:h-10 md:h-12 px-2 text-xs shrink-0`}
            onClick={() => {
              setMovement({
                ...currentMovement,
                trenchPass: !currentMovement.trenchPass,
              });
            }}
          >
            Pass Trench
          </button>
          <button
            className={`bg-${currentMovement.bumpPass ? "rose-500" : "slate-800"} w-32 h-8 sm:h-10 md:h-12 px-2 text-xs shrink-0`}
            onClick={() => {
              setMovement({
                ...currentMovement,
                bumpPass: !currentMovement.bumpPass,
              });
            }}
          >
            Pass Bump
          </button>
        </>
      )}
      <button
        className={`bg-${currentMovement.bumpStuck ? "rose-500" : "slate-800"} w-32 h-8 sm:h-10 md:h-12 px-2 text-xs shrink-0`}
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
