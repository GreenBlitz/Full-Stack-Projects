// בס"ד
import type { FC } from "react";
import { ScoutMatch } from "./scouter/pages/ScoutMatch";
import { Route, Routes } from "react-router-dom";
import { ScoutedMatches } from "./scouter/pages/ScoutedMatches";
import { CompareTwo } from "./scouter/components/CompareTwo";
import { GeneralDataTable } from "./scouter/components/GeneralDataTable";

const App: FC = () => {
  return (
    <Routes>
      <Route path="*" element={<ScoutedMatches />} />
      <Route path="/scout" element={<ScoutMatch />} />
      <Route path="/compare" element={<CompareTwo />} />
      <Route
        path="/table"
        element={
          <GeneralDataTable filters={{ "match.type": "qualification" }} />
        }
      />
    </Routes>
  );
};
export default App;
