import React, { type FC, type Dispatch, type SetStateAction } from "react";
import { type ScoutingForm } from "@repo/scouting_types";
const MATCH_NUMBER_MAX = 127;
const TEAM_NUMBER_MAX = 16383;
const PreMatchTab: FC<{
  form: ScoutingForm;
  setForm: Dispatch<SetStateAction<ScoutingForm>>;
}> = ({ form, setForm }) => {
  return (
    <div className="flex flex-col items-center w-full gap-3 py-5 mx-auto">
      <div className="flex w-[460px] justify-between items-center text-green-500">
        <div>Scouter Name:</div>
        <input
          type="text"
          className="inputStyle"
          value={form.scouterName}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              scouterName: e.target.value,
            }))
          }
        />
      </div>
      <div className="flex w-[460px] justify-between items-center text-green-500">
        <div>Match Number:</div>
        <input
          type="number"
          className="inputStyle"
          min={0}
          max={MATCH_NUMBER_MAX}
          value={form.match.number}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              match: {
                ...prev.match,
                number: Number(e.target.value),
              },
            }))
          }
        />
      </div>
      <div className="flex w-[460px] justify-between items-center text-green-500">
        <div>Team Number:</div>
        <input
          type="number"
          className="inputStyle"
          min={0}
          max={TEAM_NUMBER_MAX}
          value={form.teamNumber}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              teamNumber: Number(e.target.value),
            }))
          }
        />
      </div>
      <div className="flex w-[460px] justify-between items-center text-green-500">
        <div>Match Type:</div>
        <select
          className="inputStyle"
          value={form.match.type}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              match: {
                ...prev.match,
                type: e.target.value as
                  | "practice"
                  | "qualification"
                  | "playoff",
              },
            }))
          }
        >
          <option value="practice">Practice</option>
          <option value="qualification">Qualification</option>
          <option value="playoff">Playoff</option>
        </select>
      </div>


    </div>
  );
};

export { PreMatchTab as Buttons };
