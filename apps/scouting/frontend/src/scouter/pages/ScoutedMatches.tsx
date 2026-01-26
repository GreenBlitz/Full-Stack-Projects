// בס"ד

import type { FC } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useLocalStorage } from "@repo/local_storage_hook";
import { type ScoutingForm, scoutingFormSerde } from "@repo/scouting_types";

export const ScoutedMatches: FC = () => {
  const [scoutedMatches, setScoutedMatches] = useLocalStorage<ScoutingForm[]>(
    "scouted_forms",
    [],
  );

  return (
    <div>
      {scoutedMatches.map((match, index) => (
        <QRCodeSVG key={index} value={"Gurt"} />
      ))}
    </div>
  );
};
