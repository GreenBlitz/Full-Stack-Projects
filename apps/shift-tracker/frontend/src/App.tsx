// בס"ד
import { useMemo, useState, type FC } from "react";
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
  const [breakTime, setBreakTime] = useState(5);

  const manualShiftStats = useManualShiftStats(breakTime, isWinner);
  const ntShiftStats = useNTShiftStats();

  const [isManual, setManual] = useState(true);

  const stats = useMemo(
    () => (isManual ? manualShiftStats : ntShiftStats),
    [manualShiftStats, ntShiftStats],
  );

  const { time, color, remaining } = useTranslateToTimeAndColor(
    stats.timeLeft,
    stats.isAuto,
    breakTime,
    isWinner,
  );

  return (
    <div className="w-screen h-screen text-white">
      <div className={`flex flex-col w-full h-full  ${color}`}>
        <div className="w-min mx-auto text-2xl my-5">{secondsToTime(time)}</div>
        <div className="w-min mx-auto text-8xl my-5">
          {Math.floor(remaining)}
        </div>

        <button className="bg-violet-800" onClick={stats.start}>
          Start
        </button>
        <button
          className="bg-blue-900"
          onClick={() => setManual((prev) => !prev)}
        >
          {isManual ? "Manual" : "Driver"}
        </button>
        <button
          className="bg-sky-700"
          onClick={() => setIsWinner((prev) => !prev)}
        >
          {isWinner ? "Auto✅" : "Auto ❌"}
        </button>
        <button className="bg-red-900" onClick={manualShiftStats.restart}>
          Restart
        </button>
        <input
          type="number"
          className="bg-gray-300 text-black w-64 mx-auto mt-1 border-2 text-center"
          placeholder="Break Time"
          defaultValue={breakTime}
          onChange={(event) => {
            setBreakTime(Number(event.currentTarget.value));
          }}
        />
      </div>
    </div>
  );
};

export default App;
