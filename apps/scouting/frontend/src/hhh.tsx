import React, {
  type FC,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
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
        value={form.teamNumber}
        onChange={(e) => {
          setForm((prev) => ({
            ...prev,
            teamNumber: parseInt(e.target.value),
          }));
        }}
      />

      <input
        type="string"
        placeholder="Match Type Filed"
        style={inputStyle}
        value={form.matchType}
        onChange={(e) => {
          setForm((prev) => ({
            ...prev,
            matchType: e.target.value as
              | "practice"
              | "qualification"
              | "playoff",
          }));
        }}
      />
    </div>
  );
};

const App: FC = () => {
  const [form, setForm] = useState<ScoutingForm>({
    scouterName: "",
    matchNumber: 0,
    teamNumber: 0,
    matchType: "",
  });

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#1a1a1a",
        minHeight: "100vh",
      }}
    >
      <Buttons form={form} setForm={setForm} />
    </div>
  );
};

export default App;




