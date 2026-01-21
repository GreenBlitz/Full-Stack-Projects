// בס"ד
import { useState, type FC } from "react";
import type { Point } from "@repo/scouting_types";
import { ScoreMap } from "./components/ScoreMap";

const App: FC = () => {
  const [point, setPoint] = useState<Point>();

  return (
    <div className="justify-items-center">
      <ScoreMap
        setPosition={setPoint}
        currentPoint={point}
        mapZone="red"
        alliance="red"
      />
    </div>
  );
};

export default App;
