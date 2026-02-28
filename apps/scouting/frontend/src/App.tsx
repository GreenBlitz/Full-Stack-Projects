// בס"ד
import type { FC } from "react";
import { ScoutMatch } from "./scouter/pages/ScoutMatch";
import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import { ScoutedMatches } from "./scouter/pages/ScoutedMatches";
import {Scanning} from "./scouter/pages/barcodeScanner";
const App: FC = () => {
const [barcode, setBarcode] = useState<string>("");
  return (
    <Routes>
      <Route path="/scan" element={<Scanning setBarcode={setBarcode} />} />
      <Route path="/scout" element={<ScoutMatch />} />
      <Route path="*" element={<ScoutedMatches />} />

    </Routes>
  );
};
export default App;
