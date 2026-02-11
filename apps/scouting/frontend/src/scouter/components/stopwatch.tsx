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

interface StopwatchProps {
  addCycleTimeSeconds: Dispatch<Interval>;
  originTime: number;
  disabled: boolean;
  size?: "default" | "compact";
  onStart?: () => void;
  onStop?: () => void;
}

const Stopwatch: React.FC<StopwatchProps> = ({
  addCycleTimeSeconds,
  originTime,
  disabled,
  size = "default",
  onStart,
  onStop,
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
    // Call onStart callback if provided to notify parent component that shooting started
    onStart?.();
  };

  const stop = () => {
    if (!isRunning) {
      return;
    }

    const cycleStopwatchCounter: Interval = {
      start: startCurrentCycleTime.current,
      end: getCurrentRelativeTime(),
    };

    addCycleTimeSeconds(cycleStopwatchCounter);

    setIsRunning(false);
    reset();
    // Call onStop callback if provided to notify parent component that shooting stopped
    onStop?.();
  };

  const formatTime = () => {
    const seconds = String(calculateSeconds()).padStart(DECIMAL_PLACES, "0");
    const milliseconds = String(calculateMilliSeconds()).padStart(
      DECIMAL_PLACES_MILLISECONDS,
      "0",
    );
    return `${seconds}:${milliseconds}`;
  };

  const isCompact = size === "compact";

  return (
    <div
      className={`flex flex-col items-center ${
        isCompact ? "py-1 px-1 sm:py-2 sm:px-2" : "py-6 px-5"
      }`}
    >
      <div
        className={`
          select-none cursor-pointer rounded-2xl
          ${isCompact ? "px-2 py-1 text-xl sm:px-3 sm:py-2 sm:text-2xl" : "px-4 py-4 text-3xl"}
          font-mono font-semibold shadow-lg transition-all duration-150
          ${disabled ? "bg-slate-800 text-slate-900" : isRunning ? "bg-emerald-500 text-white scale-95" : "bg-slate-800 text-green-400 hover:bg-slate-700"}
        `}
        onMouseDown={start}
        onMouseUp={stop}
        onMouseLeave={stop}
        onTouchStart={start}
        onTouchEnd={stop}
      >
        {formatTime()}
      </div>
    </div>
  );
};

export default Stopwatch;
