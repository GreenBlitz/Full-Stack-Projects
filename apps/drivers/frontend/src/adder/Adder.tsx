import { type ChangeEvent, useState } from "react";
import axios from "axios";

export const Adder = () => {
  const [message, setMessage] = useState("");

  const addLog = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    const file = changeEvent.target.files?.item(0) as File;
    const formData = new FormData();
    formData.append("file", file);
    axios.post("http://localhost:3000/logs/", formData).then((res) => {
      setMessage(res.statusText);
    });
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
      <br />
      <p>{message}</p>
    </>
  );
};
