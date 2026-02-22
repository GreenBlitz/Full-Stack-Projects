// בס"ד
import type { FC } from "react";
import { ScoutMatch } from "./scouter/pages/ScoutMatch";
import { Route, Routes } from "react-router-dom";
import { ScoutedMatches } from "./scouter/pages/ScoutedMatches";
import { TeamTab } from "./strategy/components/TeamTab";
import { MatchForecast } from "./strategy/components/forecast/MatchForecast";
import { GeneralDataTable } from "./strategy/GeneralDataTable";
import { CompareTwo } from "./strategy/CompareTwo";
import { Leaderboard } from "./scouter/pages/Leaderboard";
import { CURRENT_COMPETITION } from "@repo/scouting_types";

const App: FC = () => {
  return (
    <Routes>
      <Route path="*" element={<ScoutedMatches />} />
      <Route path="/scout" element={<ScoutMatch />} />
      <Route path="/team" element={<TeamTab />} />
      <Route path="/general" element={<GeneralDataTable filters={{}} />} />
      <Route path="/forecast" element={<MatchForecast />} />
      <Route path="/compare" element={<CompareTwo />} />
      <Route
        path="/leaderboard"
        element={<Leaderboard competition={CURRENT_COMPETITION} />}
      />
    </Routes>
  );
};
export default App;
