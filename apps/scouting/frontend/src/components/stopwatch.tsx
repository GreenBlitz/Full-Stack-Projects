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
}

const Stopwatch: React.FC<StopwatchProps> = ({
  addCycleTimeSeconds,
  originTime,
  disabled,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(INITIAL_TIME_MILLISECONDS);

  const startTimeRef = useRef(INITIAL_TIME_MILLISECONDS);

  const startCurrentCycleTime = useRef<number>(INITIAL_TIME_MILLISECONDS);

  function reset() {
    setElapsedTime(INITIAL_TIME_MILLISECONDS);
    setIsRunning(false);
  }

  function calculateSeconds() {
    return Math.floor(
      (elapsedTime / MILLLISECONDS_IN_A_SECOND) % SECOND_IN_A_MINUTE,
    );
  }

  function calculateMilliSeconds() {
    return Math.floor(elapsedTime % MILLLISECONDS_IN_A_SECOND);
  }

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

  function start() {
    if (isRunning || disabled) {
      return;
    }
    const relativeTime = getCurrentRelativeTime();
    startCurrentCycleTime.current = relativeTime;

    startTimeRef.current = Date.now() - elapsedTime;
    setIsRunning(true);
  }

  function stop() {
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
  }

  function formatTime() {
    const seconds = String(calculateSeconds()).padStart(DECIMAL_PLACES, "0");
    const milliseconds = String(calculateMilliSeconds()).padStart(
      DECIMAL_PLACES_MILLISECONDS,
      "0",
    );
    return `${seconds}:${milliseconds}`;
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div
        className={`
          select-none cursor-pointer rounded-2xl px-4 py-2
          text-2xl font-mono font-semibold shadow-lg transition-all duration-150
          ${disabled ? "bg-slate-800 text-slate-900" : isRunning ? "bg-emerald-500 text-white scale-95" : "bg-slate-800 text-emerald-400 hover:bg-slate-700"}
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
