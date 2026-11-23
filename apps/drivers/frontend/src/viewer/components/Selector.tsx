import * as React from "react";
import type { FindCursor } from "mongodb";
import type { DrivingData } from "@repo/drivers-types";

interface SelectorProps {
  cursor: FindCursor<DrivingData>;
}

export const Selector: React.FC<SelectorProps> = () => {
  return (
    <>
      <select></select>
    </>
  );
};
