// בס"ד

import type { Dispatch, FC } from "react";
import type { ScoutingForm } from "@repo/scouting_types";

type Movement = ScoutingForm["tele"]["movement"] | ScoutingForm["auto"]["movement"];

interface MovementFormProps {
  setMovement: Dispatch<Movement>;
  currentMovement: Movement;
  isAuto?: boolean;
}

export const MovementForm: FC<MovementFormProps> = ({
  setMovement,
  currentMovement,
  isAuto = false,
}) => {
  return (
    <div className="flex flex-col items-center gap-1 shrink-0">
      {isAuto && "trenchPass" in currentMovement && (
        <>
          <button
            className={`bg-${(currentMovement).trenchPass ? "rose-500" : "slate-800"} w-32 h-8 sm:h-10 md:h-12 px-2 text-xs shrink-0`}
            onClick={() => {
              setMovement({
                ...currentMovement,
                trenchPass: !(currentMovement).trenchPass,
              });
            }}
          >
            Pass Trench
          </button>
          <button
            className={`bg-${(currentMovement).bumpPass ? "rose-500" : "slate-800"} w-32 h-8 sm:h-10 md:h-12 px-2 text-xs shrink-0`}
            onClick={() => {
              setMovement({
                ...currentMovement,
                bumpPass: !(currentMovement).bumpPass,
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
