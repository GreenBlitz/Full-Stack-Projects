import * as React from "react";
import type { DrivingData } from "@repo/drivers-types";

interface SelectorProps {
  drivingDataArray: DrivingData[];
}

export const Selector: React.FC<SelectorProps> = () => {
  return (
    <>
      <select></select>
    </>
  );
};
