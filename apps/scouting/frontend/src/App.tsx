// בס"ד
import type { FC } from "react";
import { ScoutMatch } from "./scouter/pages/ScoutMatch";
import { Route, Routes } from "react-router-dom";
import { ScoutedMatches } from "./scouter/pages/ScoutedMatches";
import { HeatMap } from "./strategy/components/HeatMap";

const FIELD_IMAGE_DIMENSION = 4418;
const SQUARE_ASPECT_RATIO = 1;

const App: FC = () => {
  return (
    <Routes>
      <Route path="*" element={<ScoutedMatches />} />
      <Route path="/scout" element={<ScoutMatch />} />
      <Route
        path="/HeatMap"
        element={
          <HeatMap
            positions={[]}
            path={`/full-field-${FIELD_IMAGE_DIMENSION}.png`}
            aspectRatio={SQUARE_ASPECT_RATIO}
          />
        }
      />
    </Routes>
  );
};
export default App;
