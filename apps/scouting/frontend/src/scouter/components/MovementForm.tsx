// בס"ד

import type { Dispatch, FC } from "react";
import type { ScoutingForm } from "@repo/scouting_types";

type Movement = ScoutingForm["tele"]["movement"];

interface MovementFormProps {
  setMovement: Dispatch<Movement>;
  currentMovement: Movement;
}

const MovementForm: FC<MovementFormProps> = ({
  setMovement,
  currentMovement,
}) => {
  return <div></div>;
};
