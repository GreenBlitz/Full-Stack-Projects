import React, { type FC, type Dispatch, type SetStateAction } from "react";
import { type ScoutingForm } from "@repo/scouting_types";

const MatchNumber = 127;
const MATCH_NUMBER_MAX  = 16383;
const PreMatchTab: FC<{
  form: ScoutingForm;
  setForm: Dispatch<SetStateAction<ScoutingForm>>;
}> = ({ form, setForm }) => {
  return (
    <div>
      <div className="flex flex-col items-center w-full gap-3 py-5 mx-auto">
        <div className="flex w-[460px] justify-between items-center text-green-500">
            <div className="outputName"> Scouter Name:</div>
          <div className="ml-auto">
            <input
              type="text"
              placeholder=""
              className="inputStyle"
              value={form.scouterName}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, scouterName: e.target.value }));
              }}
            />
          </div>
        </div>
        <div className="flex flex-row items-center justify-between w-[460px] text-green-500">
            <div className="outputMatch"> Match Number:</div>
          <div className="ml-auto">
            <input
              type="number"
              placeholder=""
              className="inputStyle"
              value={form.matchNumber}
              min="0"
              defaultValue=" "
              max={MatchNumber}
              onChange={(e) => {
                setForm((prev) => ({
                  ...prev,
                  matchNumber: parseInt(e.target.value),
                }));
              }}
            />
          </div>
        </div>
        <div className="flex flex-row items-center justify-between w-[460px] text-green-500">
            <div className="outputTeam"> Team Number:</div>
          <div className="ml-auto">
            <input
              type="number"
              placeholder=""
              className="inputStyle"
              min=""
              max={MATCH_NUMBER_MAX }
              value={form.teamNumber}
              onChange={(e) => {
                setForm((prev) => ({
                  ...prev,
                  teamNumber: parseInt(e.target.value),
                }));
              }}
            />
          </div>
        </div>
        <div className="flex flex-row items-center justify-between w-[460px] text-green-500">
            <div className="outputTeam"> Match Type:</div>
          <div className="ml-auto">
            <select
              className="inputStyle"
              value={form.matchType}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  matchType: e.target.value as
                    | "practice"
                    | "qualification"
                    | "playoff",
                }))
              }
            >
              <option value="practice">Practice</option>
              <option value="qualification">Qualification</option>
              <option value="playoff">Playoff</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
export { PreMatchTab as Buttons };
