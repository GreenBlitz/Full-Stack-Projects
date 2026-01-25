import React, { type FC, type Dispatch, type SetStateAction } from "react";
import { type ScoutingForm } from "@repo/scouting_types";

const inputStyle: React.CSSProperties = {
  padding: "8px",
  backgroundColor: "black",
  color: "lime",
  border: "1px solid lime",
  borderRadius: "6px",
};

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
        width: "200px",

        
      }}
    >
      <input
        type="text"
        placeholder="Scouter Name"
        style={inputStyle}
        value={form.scouterName}
        onChange={(e) => {
          setForm((prev) => ({ ...prev, scouterName: e.target.value }));
        }}
      />

      <input
        type="number"
        placeholder="Match Number"
        style={inputStyle}
        value={form.matchNumber}
        min="0"
        max="127"
        onChange={(e) => {
          setForm((prev) => ({
            ...prev,
            matchNumber: parseInt(e.target.value),
          }));
        }}
      />

      <input
        type="number"
        placeholder="Team Number"
        style={inputStyle}
        min="0"
        max="16383"
        value={form.teamNumber}
        onChange={(e) => {
          setForm((prev) => ({
            ...prev,
            teamNumber: parseInt(e.target.value),
          }));
        }}
      />

      <select
        style={inputStyle}
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
    
  );
};



export { Buttons };
