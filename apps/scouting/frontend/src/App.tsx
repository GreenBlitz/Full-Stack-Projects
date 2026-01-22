// בס"ד
import { useState, type FC } from "react";
import type { Point } from "@repo/scouting_types";
import Stopwatch from "./components/stopwatch";

const App: FC = () => {
  return (
    <div className="justify-items-center">
      <Stopwatch />
    </div>
  );
};
export default App;
