// בס"ד
import { useEffect, useMemo, useState, type FC } from "react";
import {
  useTranslateToTimeAndColor,
  useNTShiftStats,
  useManualShiftStats,
} from "./shifts";


const secondsToTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0")}`;

const App: FC = () => {
  const { start, isAuto, timeLeft, restart } = useManualShiftStats(7);

  const { time, color } = useTranslateToTimeAndColor(timeLeft, isAuto);

  return (
    <div className="w-screen h-screen">
      <div className={`flex flex-col w-full h-full  ${color}`}>
        <h1 className="w-min mx-auto my-5">{secondsToTime(time)}</h1>
        <button onClick={restart}>Restart</button>
        <button onClick={start}>Start</button>
      </div>
    </div>
  );
};

export default App;
