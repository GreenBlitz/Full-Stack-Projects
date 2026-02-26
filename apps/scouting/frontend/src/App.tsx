// בס"ד
import type { FC } from "react";
import { ScoutMatch } from "./scouter/pages/ScoutMatch";
import { Route, Routes } from "react-router-dom";
import { ScoutedMatches } from "./scouter/pages/ScoutedMatches";
import { TeamTab } from "./strategy/tabs/team/TeamTab";
import { MatchForecast } from "./strategy/tabs/forecast/MatchForecast";
import { GeneralDataTable } from "./strategy/tabs/GeneralDataTable";
import { CompareTwo } from "./strategy/tabs/CompareTwo";
import BpsBase from "./scouter/components/bps-components/BpsBase";
import { Leaderboard } from "./scouter/pages/Leaderboard";
import { CURRENT_COMPETITION } from "@repo/scouting_types";
import { StrategyNavigationBar } from "./strategy/components/StrategyNavBar";

const App: FC = () => {
  return (
    <Routes>
      <Route path="*" element={<ScoutedMatches />} />
      <Route path="/scout" element={<ScoutMatch />} />
      <Route
        path="/leaderboard"
        element={<Leaderboard competition={CURRENT_COMPETITION} />}
      />
      <Route path="bps" element={<BpsBase />} />

      <Route path="/strategy" element={<StrategyNavigationBar />}>
        <Route path="team" element={<TeamTab />} />
        <Route path="general" element={<GeneralDataTable filters={{}} />} />
        <Route path="forecast" element={<MatchForecast />} />
        <Route path="compare" element={<CompareTwo />} />
      </Route>
    </Routes>
  );
};
export default App;
