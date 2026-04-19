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
import SettingsPage from "./scouter/pages/SettingsPage";
import { CURRENT_COMPETITION } from "@repo/scouting_types";
import { StrategyNavigationBar } from "./strategy/components/StrategyNavBar";
import { SuperScoutTab } from "./strategy/tabs/super-scout/SuperScoutTab";
import { Tinder } from "./strategy/tabs/Tinder";

const App: FC = () => {
  return (
    <Routes>
      <Route path="/scout" element={<ScoutMatch />} />
      <Route
        path="/leaderboard"
        element={<Leaderboard competition={CURRENT_COMPETITION} />}
      />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/strategy" element={<StrategyNavigationBar />}>
        <Route path="team" element={<TeamTab />} />
        <Route path="general" element={<GeneralDataTable filters={{}} />} />
        <Route path="forecast" element={<MatchForecast />} />
        <Route path="compare" element={<CompareTwo />} />
        <Route path="super" element={<SuperScoutTab />} />
        <Route path="tinder" element={<Tinder />} />
      </Route>
      <Route path="*" element={<ScoutedMatches />} />
    </Routes>
  );
};
export default App;
