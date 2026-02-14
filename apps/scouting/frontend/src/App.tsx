// בס"ד
import type { FC } from "react";
import { ScoutMatch } from "./scouter/pages/ScoutMatch";
import { Route, Routes } from "react-router-dom";
import { ScoutedMatches } from "./scouter/pages/ScoutedMatches";
import { TeamTab } from "./strategy/components/TeamTab";
import { GeneralDataTable } from "./scouter/components/GeneralDataTable";
import { MatchForecast } from "./strategy/components/MatchForecast";

const App: FC = () => {
  return (
    <Routes>
      <Route path="/scout" element={<ScoutMatch />} />
      <Route path="/team" element={<TeamTab />} />
      <Route path="/general" element={<GeneralDataTable filters={{}} />} />
      <Route path="*" element={<ScoutedMatches />} />
      <Route path="/forecast" element={<MatchForecast />} />
    </Routes>
  );
};
export default App;
