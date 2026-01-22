import React, { useEffect, useRef, useState } from "react";

interface CycleStopwatchCounter {
  startCycleTime: number;
  endCycleTimer: number;
}

const MILLLISECONDS_IN_A_SECOND = 1000;
const SECOND_IN_A_MINUTE = 60;

const Stopwatch: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [cycleTimes, setCycleTimes] = useState<CycleStopwatchCounter[]>([]);

  const startTimeRef = useRef(0);
  const originRef = useRef<number | null>(null);

  const startCurrentCycleTime = useRef<number>(0);

  const getCurrentRelativeTime = () => {
    if (originRef.current === null) originRef.current = Date.now();
    return Date.now() - originRef.current;
  };

  useEffect(() => {
    if (!isRunning) {
      return;
    }
    const intervalId = window.setInterval(() => {
      setElapsedTime(Date.now() - startTimeRef.current);
    }, 10);

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
    setCycleTimes((prev) => [...prev, cycleStopwatchCounter]);

    setIsRunning(false);
    reset();
  }

  function reset() {
    setElapsedTime(0);
    setIsRunning(false);
  }

  useEffect(() => {
    console.log(cycleTimes);
  }, [cycleTimes]);

  function formatTime() {
    const minutes = String(calculateMinutes()).padStart(2, "0");
    const seconds = String(calculateSeconds()).padStart(2, "0");
    const milliseconds = String(calculateMilliSeconds()).padStart(2, "0");
    return `${minutes}:${seconds}:${milliseconds}`;
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
