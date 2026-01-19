import React, { type FC } from "react";
import { type Dispatch, type SetStateAction } from "react";
import { type ScoutingForm } from "./types";

const inputStyle = {
  padding: "8px",
  backgroundColor: "black",
  color: "lime",
  border: "1px solid lime",
  borderRadius: "6px",
};

const Buttons: FC <{ setForm: SetStateAction<Dispatch<ScoutingForm>> }> = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "200px" }}>
      <input type="text" placeholder="Name Field" style={inputStyle} />
      <input type="text" placeholder="Match Number Field" style={inputStyle} />
      <input type="text" placeholder="Team Field" style={inputStyle} />
    </div>
  );
};

const App: FC = () => {
  return <Buttons />;
};

export default App;
