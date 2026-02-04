// בס"ד
import type { FC } from "react";
import { ScoutMatch } from "./scouter/pages/ScoutMatch";
import { Route, Routes } from "react-router-dom";
import { ScoutedMatches } from "./scouter/pages/ScoutedMatches";
import { GeneralDataTable } from "./scouter/components/GeneralDataTable";

const App: FC = () => {
  return (
    <>
      <GeneralDataTable filters={{ "match[type]": "qualification" }} />
    </>
  );
};
export default App;
