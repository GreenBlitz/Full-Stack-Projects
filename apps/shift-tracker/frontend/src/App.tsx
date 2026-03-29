// בס"ד
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import {
  useTranslateToTimeAndColor,
  useManualShiftStats,
  useNTShiftStats,
} from "./shifts";

const secondsToTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0")}`;

const App: FC = () => {
  const [isWinner, setIsWinner] = useState(true);

  const manualShiftStats = useManualShiftStats(7, isWinner);
  const ntShiftStats = useNTShiftStats();

  const [isManual, setManual] = useState(true);

  const stats = useMemo(
    () => (isManual ? manualShiftStats : ntShiftStats),
    [manualShiftStats, ntShiftStats],
  );

  const { time, color } = useTranslateToTimeAndColor(
    stats.timeLeft,
    stats.isAuto,
    stats.isWinner ?? true,
  );

  console.log("isManual", isManual, " time:", stats.timeLeft);

  return (
    <div className="w-screen h-screen">
      <div className={`flex flex-col w-full h-full  ${color}`}>
        <h1 className="w-min mx-auto my-5">{secondsToTime(time)}</h1>
        <button onClick={manualShiftStats.restart}>Restart</button>
        <button onClick={stats.start}>Start</button>
        <button onClick={() => setManual((prev) => !prev)}>
          {isManual ? "Manual" : "Driver"}
        </button>
        <button onClick={() => setIsWinner((prev) => !prev)}>
          {isWinner ? "Auto✅" : "Auto ❌"}
        </button>
      </div>
    </div>
  );
};

export default App;
