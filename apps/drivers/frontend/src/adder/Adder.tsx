import type { ChangeEvent } from "react";

export const Adder = () => {
  const addLog = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    const logFile = changeEvent.target.files?.item(0) as File;
    const formData = new FormData();
    formData.append("logFile", logFile);
  };
  return (
    <>
      <label htmlFor="logFile">Add a log file: </label>
      <input
        onChange={addLog}
        type="file"
        id="logFile"
        name="logFile"
        required={true}
        accept={".wpilog"}
      />
    </>
  );
};
