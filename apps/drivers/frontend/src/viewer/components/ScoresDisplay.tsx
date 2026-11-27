import * as React from "react";
import type { DrivingData } from "@repo/drivers-types";

interface ScoresDisplayProps {
  drivingData: DrivingData;
}

export const ScoresDisplay: React.FC<ScoresDisplayProps> = ({
  drivingData,
}) => {
  return (
    <>
      {Object.entries(drivingData.scores).map(([key, value]) => {
        return <h3>{key + ": " + value}</h3>;
      })}
    </>
  );
};
