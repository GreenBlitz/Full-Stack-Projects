import type { SetStateAction, SyntheticEvent } from "react";
import * as React from "react";
import { type DrivingData, drivingDataSchema } from "@repo/drivers-types";

interface SelectorProps {
  setDrivingData: React.Dispatch<SetStateAction<DrivingData>>;
  drivingDataArray: DrivingData[];
}

export const Selector: React.FC<SelectorProps> = ({
  setDrivingData,
  drivingDataArray,
}) => {
  const setDrivingDataOnSelect = (
    selectEvent: SyntheticEvent<HTMLSelectElement>,
  ) => {
    setDrivingData(drivingDataSchema.parse(selectEvent.target.toString()));
  };

  return (
    <>
      <select onSelect={setDrivingDataOnSelect}>
        <optgroup label={"competition"}>
          {drivingDataArray.map((drivingData) => {
            if (drivingData.log.match.type !== "test") {
              return (
                <option value={JSON.stringify(drivingData)}>
                  {drivingData.log.match.type +
                    " " +
                    drivingData.log.match.number}
                </option>
              );
            }
          })}
        </optgroup>
        <optgroup label={"test"}>
          {drivingDataArray
            .filter((drivingData) => drivingData.log.match.type === "test")
            .map((drivingData: DrivingData) => (
              <option value={JSON.stringify(drivingData)}>
                {drivingData.log.name +
                  " " +
                  drivingData.log.date.toISOString()}
              </option>
            ))}
        </optgroup>
      </select>
    </>
  );
};
