// בס"ד
import type { FC } from "react";
import { ScoutMatch } from "./scouter/pages/ScoutMatch";
import { Route, Routes } from "react-router-dom";
import { ScoutedMatches } from "./scouter/pages/ScoutedMatches";

const App: FC = () => {
  return (
    <Routes>
      <Route path="*" element={<ScoutMatch />} />
      <Route path="/matches" element={<ScoutedMatches />} />
    </Routes>
  );
};
export default App;
