import type { Dispatch, FC } from "react";
import type { Alliance, Movement } from "@repo/scouting_types";

// Types for better internal handling
type MovementKey = keyof Movement["ally"];

interface MovementFormProps {
  setMovement: Dispatch<Movement>;
  currentMovement: Movement;
  allianceColor: Alliance;
}

/**
 * Main Form Component
 * Layout fixed to use CSS Grid properly.
 */
export const MovementForm: FC<MovementFormProps> = ({
  setMovement,
  currentMovement,
  allianceColor,
}) => {
  const alliances: Alliance[] = ["red", "blue"];

  const toAlignment = (color: Alliance) =>
    color === allianceColor ? "ally" : "opponent";
  return (
    <div className="grid grid-cols-2 gap-6 p-4 max-w-2xl mx-auto">
      {alliances.map((color) => (
        <MovementSideForm
          key={color}
          color={color}
          currentMovement={currentMovement[toAlignment(color)]}
          setMovement={(newSideData) =>
            setMovement({
              ...currentMovement,
              [toAlignment(color)]: newSideData,
            })
          }
        />
      ))}
    </div>
  );
};

interface MovementSideFormProps {
  setMovement: (data: Movement["ally"]) => void;
  currentMovement: Movement["ally"];
  color: Alliance;
}

/**
 * Individual Alliance Column
 */
const MovementSideForm: FC<MovementSideFormProps> = ({
  setMovement,
  currentMovement,
  color,
}) => {
  const fields: { label: string; key: MovementKey }[] = [
    { label: "Trench", key: "trenchPass" },
    { label: "Stuck", key: "bumpStuck" },
    { label: "Bump", key: "bumpPass" },
  ];

  const handleIncrement = (key: MovementKey) => {
    setMovement({
      ...currentMovement,
      [key]: (currentMovement[key] || 0) + 1,
    });
  };

  return (
    <div className="flex flex-col items-center gap-4  p-4 rounded-xl ">
      {fields.map((field) => (
        <MovementButton
          key={field.key}
          label={field.label}
          count={currentMovement[field.key]}
          color={color}
          onClick={() => handleIncrement(field.key)}
        />
      ))}
    </div>
  );
};

interface MovementButtonProps {
  label: string;
  onClick: () => void;
  count: number;
  color: Alliance;
}

/**
 * Reusable Counter Button
 */
const MovementButton: FC<MovementButtonProps> = ({
  label,
  onClick,
  color,
  count,
}) => {
  // Mapping prevents Tailwind from purging the classes
  const colorVariants = {
    red: "bg-red-500 hover:bg-red-600 active:bg-red-700 ",
    blue: "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 ",
  };

  const badgeVariants = {
    red: "bg-red-700",
    blue: "bg-blue-700",
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${colorVariants[color]}
        w-full h-20 px-10 py-2
        flex flex-col items-center justify-between
        text-white rounded-lg shadow-lg
        transition-all transform active:scale-95
        select-none
      `}
    >
      <span className="font-medium uppercase opacity-90">{label}</span>
      <span
        className={`
        ${badgeVariants[color]}
        min-w-12 px-3 py-1 
        rounded-full font-mono text-lg font-bold
        shadow-inner
      `}
      >
        {count}
      </span>
    </button>
  );
};
