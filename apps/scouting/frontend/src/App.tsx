// בס"ד
import type { FC } from "react";
import { ScoutMatch } from "./scouter/pages/ScoutMatch";
import { Route, Routes } from "react-router-dom";
import { ScoutedMatches } from "./scouter/pages/ScoutedMatches";
import { TeamTab } from "./strategy/components/TeamTab";
import { GeneralDataTable } from "./strategy/GeneralDataTable";
import { CompareTwo } from "./strategy/CompareTwo";
import { Leaderboard } from "./strategy/Leaderboard";
import { CURRENT_COMPETITION } from "../../../../packages/scouting_types/rebuilt";

const App: FC = () => {
  return (
    <Routes>
      <Route path="/scout" element={<ScoutMatch />} />
      <Route path="/team" element={<TeamTab />} />
      <Route path="/general" element={<GeneralDataTable filters={{}} />} />
      <Route path="*" element={<ScoutedMatches />} />
      <Route path="/compare" element={<CompareTwo />} />
      <Route
        path="/leaderboard"
        element={<Leaderboard competition={CURRENT_COMPETITION} />}
      />
    </Routes>
  );
};
export default App;
