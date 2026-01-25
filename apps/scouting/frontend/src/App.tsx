// בס"ד
import type { FC } from "react";
import { ScoutMatch } from "./scouter/pages/ScoutMatch";
import { Climb } from "./components/Climb";

const App: FC = () => {
  return <Climb isAuto={true} />;
};
export default App;
