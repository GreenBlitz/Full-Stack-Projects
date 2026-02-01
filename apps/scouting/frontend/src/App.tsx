// בס"ד
import type { FC } from "react";
import { ScoutMatch } from "./scouter/pages/ScoutMatch";
import { Route, Routes } from "react-router-dom";
import { ScoutedMatches } from "./scouter/pages/ScoutedMatches";

const App: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ScoutedMatches />} />
      <Route path="/scout" element={<ScoutMatch />} />
    </Routes>
  );
};
export default App;
