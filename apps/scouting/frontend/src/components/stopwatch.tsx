// בס"ד
import type React from "react";
import { useEffect, useRef, useState } from "react";

interface CycleStopwatchCounter {
  startCycleTime: number;
  endCycleTimer: number;
}

const MILLLISECONDS_IN_A_SECOND = 1000;
const SECOND_IN_A_MINUTE = 60;
const INITIAL_TIME_MILLISECONDS = 0;
const CYCLE_TIME_MILLISECONDS = 10;
const DECIMAL_PLACES = 2

const Stopwatch: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(INITIAL_TIME_MILLISECONDS);
  const [cycleTimesInMilliseconds, setCycleTimesInMilliseconds] = useState<
    CycleStopwatchCounter[]
  >([]);

  const startTimeRef = useRef(INITIAL_TIME_MILLISECONDS);
  const originRef = useRef<number | null>(null);

  const startCurrentCycleTime = useRef<number>(INITIAL_TIME_MILLISECONDS);

  function reset() {
    setElapsedTime(INITIAL_TIME_MILLISECONDS);
    setIsRunning(false);
  }

  function calculateMinutes() {
    return Math.floor(
      (elapsedTime / (MILLLISECONDS_IN_A_SECOND * SECOND_IN_A_MINUTE)) %
        SECOND_IN_A_MINUTE,
    );
  }

  function calculateSeconds() {
    return Math.floor(
      (elapsedTime / MILLLISECONDS_IN_A_SECOND) % SECOND_IN_A_MINUTE,
    );
  }

  function calculateMilliSeconds() {
    return Math.floor(
      (elapsedTime % MILLLISECONDS_IN_A_SECOND) / SECOND_IN_A_MINUTE,
    );
  }

  const getCurrentRelativeTime = () => {
    originRef.current ??= Date.now();
    return Date.now() - originRef.current;
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
    if (isRunning) {
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

    const cycleStopwatchCounter: CycleStopwatchCounter = {
      startCycleTime: startCurrentCycleTime.current,
      endCycleTimer: getCurrentRelativeTime(),
    };
    setCycleTimesInMilliseconds((prev) => [...prev, cycleStopwatchCounter]);

    setIsRunning(false);
    reset();
  }

  useEffect(() => {
    console.log(cycleTimesInMilliseconds);
  }, [cycleTimesInMilliseconds]);

  function formatTime() {
    const minutes = String(calculateMinutes()).padStart(DECIMAL_PLACES, "0");
    const seconds = String(calculateSeconds()).padStart(DECIMAL_PLACES, "0");
    const milliseconds = String(calculateMilliSeconds()).padStart(DECIMAL_PLACES, "0");
    return `${minutes}:${seconds}:${milliseconds}`;
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div
        className={`
          select-none cursor-pointer rounded-2xl px-10 py-6
          text-4xl font-mono font-semibold shadow-lg transition-all duration-150
          ${isRunning ? "bg-emerald-500 text-white scale-95" : "bg-slate-800 text-emerald-400 hover:bg-slate-700"}
        `}
        onMouseDown={start}
        onMouseUp={stop}
        onMouseLeave={stop}
        onTouchStart={start}
        onTouchEnd={stop}
      >
        {formatTime()}
      </div>

      <button
        onClick={reset}
        className="
          rounded-lg px-4 py-1.5 text-sm font-medium text-slate-600
          border border-slate-300 hover:bg-slate-100 hover:text-slate-800
          active:scale-95 transition
        "
      >
        Reset
      </button>
    </div>
  );
};

export default Stopwatch;
