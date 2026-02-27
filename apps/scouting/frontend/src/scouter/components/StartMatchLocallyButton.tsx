// בס"ד
import type React from "react";
import { useEffect, useRef, useState, type Dispatch } from "react";
import type { Interval } from "@repo/scouting_types";

const MILLLISECONDS_IN_A_SECOND = 1000;
const SECOND_IN_A_MINUTE = 60;
const INITIAL_TIME_MILLISECONDS = 0;
const CYCLE_TIME_MILLISECONDS = 10;
const DECIMAL_PLACES = 2;
const DECIMAL_PLACES_MILLISECONDS = 3;

interface StartMatchLocallyButtonProps {
  originTime: number;
  disabled: boolean;
}

const StartMatchLocallyButton: React.FC<StartMatchLocallyButtonProps> = ({
  originTime,
  disabled
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(INITIAL_TIME_MILLISECONDS);

  const startTimeRef = useRef(INITIAL_TIME_MILLISECONDS);

  const startCurrentCycleTime = useRef<number>(INITIAL_TIME_MILLISECONDS);

  const reset = () => {
    setElapsedTime(INITIAL_TIME_MILLISECONDS);
    setIsRunning(false);
  };

  const calculateSeconds = () => {
    return Math.floor(
      (elapsedTime / MILLLISECONDS_IN_A_SECOND) % SECOND_IN_A_MINUTE,
    );
  };

  const calculateMilliSeconds = () => {
    return Math.floor(elapsedTime % MILLLISECONDS_IN_A_SECOND);
  };

  const getCurrentRelativeTime = () => {
    return Date.now() - originTime;
  };

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }
    const intervalId = window.setInterval(() => {
      setElapsedTime(Date.now() - startTimeRef.current);
    }, CYCLE_TIME_MILLISECONDS);

    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning]);

  const start = () => {
    if (isRunning || disabled) {
      return;
    }
    const relativeTime = getCurrentRelativeTime();
    startCurrentCycleTime.current = relativeTime;

    startTimeRef.current = Date.now() - elapsedTime;
    setIsRunning(true);
  };

  const stop = () => {
    if (!isRunning) {
      return;
    }
    setIsRunning(false);
    reset();
  };

  const formatTime = () => {
    const seconds = String(calculateSeconds()).padStart(DECIMAL_PLACES, "0");
    const milliseconds = String(calculateMilliSeconds()).padStart(
      DECIMAL_PLACES_MILLISECONDS,
      "0",
    );
    return `${seconds}:${milliseconds}`;
  };
  return (
    <div
      className={`flex flex-col items-center `}
    >
      <div
        className={`
          select-none cursor-pointer rounded-2xl
          font-mono font-semibold shadow-lg transition-all duration-150
          ${disabled ? "bg-slate-800 text-slate-900" : isRunning ? "bg-emerald-500 text-white scale-95" : "bg-slate-800 text-green-400 hover:bg-slate-700"}
        `}
        onClick={start}
      >
        {formatTime()}
      </div>
    </div>
  );
};

export default StartMatchLocallyButton;
