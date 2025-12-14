// בס"ד
import { useEffect, useState } from "react";
import "./App.css";
import LimelightTable from "./LimelightTable";

function app() {
  const [message, setMessage] = useState("Loading...");
  const [isRobotOnline, setIsRobotOnline] = useState(false);
  const twoSeconds = 2000;

useEffect(() => {
  void (async () => {
    try {
      const res = await fetch("http://localhost:5000/");
      const text = await res.text();
      setMessage(text);
    } catch (e) {
      setMessage("Error connecting to server");
      console.error(e);
    }
  })();
}, []);


  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:4590/");
        const text = await res.text();
        setMessage(text);
        setIsRobotOnline(text.includes("Welcome"));
      } catch {
        setIsRobotOnline(false);
      }
    }, twoSeconds);
    return () => {clearInterval(interval)};
  }, []);

  return (
    <>
      <div>
        <img src="\src\assets\greenblitz.png" className="logo" alt="Logo" />
        <p>{message}</p>
      </div>
      <LimelightTable
        robotOnline={isRobotOnline}
        cameras={[false, false, false]}
      />
    </>
  );
}

export default app;
