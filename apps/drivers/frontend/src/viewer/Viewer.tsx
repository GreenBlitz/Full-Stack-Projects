import { useEffect, useState } from "react";
import type { DrivingData } from "@repo/drivers-types";
import axios from "axios";
import { SERVER_URL } from "../App.tsx";
import { Selector } from "./components/Selector.tsx";
import { ScoresDisplay } from "./components/ScoresDisplay.tsx";
import { StatusCodes } from "http-status-codes";

export const Viewer = () => {
  const [drivingDataArray, setDrivingDataArray] = useState<DrivingData[]>([]);
  const [drivingData, setDrivingData] = useState<DrivingData | undefined>(
    undefined,
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  useEffect(() => {
    axios.get(SERVER_URL + "/logs").then((result) => {
      if (result.status === StatusCodes.OK) {
        setDrivingDataArray(result.data);
      } else {
        setErrorMessage("Error " + result.statusText + ": " + result.data);
      }
    });
  });
  return (
    <>
      <Selector
        setDrivingData={setDrivingData}
        drivingDataArray={drivingDataArray}
      />
      <ScoresDisplay drivingData={drivingData} />
      <h2>{errorMessage}</h2>
    </>
  );
};
