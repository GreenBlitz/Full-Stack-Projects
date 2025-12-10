// בס"ד
import { useEffect, useState } from "react";
import "./App.css";
import LimelightTable from "./LimelightTable";

function App() {
  const [message, setMessage] = useState("Loading...");
  const [robotOnline, setRobotOnline] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/")
      .then((res) => res.text())
      .then(setMessage)
      .catch((e) => {
        setMessage("Error connecting to server");
        console.error(e);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:4590/");
        const text = await res.text();
        setMessage(text);
        setRobotOnline(text.includes("Welcome"));
      } catch {
        setRobotOnline(false);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div>
        <img src="src/assets/gb-logo.png" className="logo" alt="Logo" />
        <p>{message}</p>
      </div>
      <LimelightTable
        robotOnline={robotOnline}
        cameras={[false, false, false]}
      />
    </>
  );
}

export default App;
