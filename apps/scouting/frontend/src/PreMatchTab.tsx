import React, { type FC, type Dispatch, type SetStateAction } from "react";
import { type ScoutingForm } from "@repo/scouting_types";

const inputStyle: React.CSSProperties = {
  padding: "18px",
  backgroundColor: "black",
  color: "green",
  border: "2px solid lime",
  borderRadius: "15px",
  fontSize: "20px",
  width: "300px",
  margin: "10px 0",
};
const MatchNumber = 127;
const TeamNumber = 16383;
const Buttons: FC<{
  form: ScoutingForm;
  setForm: Dispatch<SetStateAction<ScoutingForm>>;
}> = ({ form, setForm }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "100%",
      }}
    >
      <div className="flex flex-row items-center w-108">
      <div className="Design text-green-500">
        <div className="outputName"> Scouter Name:</div>
      </div>
      <div className="ml-auto">
        <input
          type="text"
          placeholder=""
          style={inputStyle}
          value={form.scouterName}
          onChange={(e) => {
            setForm((prev) => ({ ...prev, scouterName: e.target.value }));
          }}
        />
      </div>
      </div>

      <div className="flex flex-row items-center w-108">
      <div className="Design  text-green-500">
        <div className="outputMatch"> Match Number:</div>
      </div>
      <div className="ml-auto">
      <input
        type="number"
        placeholder=""
        style={inputStyle}
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


      <div className="flex flex-row items-center w-108">
      <div className="Design  text-green-500">
        <div className="outputTeam"> Team Number:</div>
      </div>
      <div className="ml-auto">

      <input
        type="number"
        placeholder=""
        style={inputStyle}
        min=""
        max={TeamNumber}
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


      <div className="flex flex-row items-center w-108">
      <div className="Design  text-green-500">
        <div className="outputTeam"> Match Type:</div>
      </div>
      <div className="ml-auto">
      <select
        style={inputStyle}
        className=""
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

  );
};
export { Buttons };