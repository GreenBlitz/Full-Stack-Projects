import React, { useEffect, useRef, useState } from "react";

const 

function Stopwatch() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const [cycleStartTimes, setCycleStartTimes] = useState<number[]>([]);
  const [cycleEndTimes, setCycleEndTimes] = useState<number[]>([]);

  const intervalIdRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);
  const originRef = useRef<number | null>(null);

  const getCurrentRelativeTime = () => {
    if (originRef.current === null)
       originRef.current = Date.now();
    return Date.now() - originRef.current;
  };

  useEffect(() => {
    if (isRunning) {
      intervalIdRef.current = window.setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 10);
    }

    return () => {
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [isRunning]);

  function start() {
    if (isRunning) {return}
      const rel = getCurrentRelativeTime();
      setCycleStartTimes((prev) => [...prev, rel]);

      startTimeRef.current = Date.now() - elapsedTime;
      setIsRunning(true);
    
  }

  function stop() {
    if (!isRunning) return;

    const relativeTime = getCurrentRelativeTime();
    setCycleEndTimes((prev) => [...prev, relativeTime]);

    setIsRunning(false);
  }

  function reset() {
    setElapsedTime(0);
    setIsRunning(false);
  }

  function formatTime() {
    const minutes = String(Math.floor((elapsedTime / (1000 * 60)) % 60)).padStart(2, "0");
    const seconds = String(Math.floor((elapsedTime / 1000) % 60)).padStart(2, "0");
    const milliseconds = String(Math.floor((elapsedTime % 1000) / 10)).padStart(2, "0");
    return `${minutes}:${seconds}:${milliseconds}`;
  }

  useEffect(() => {
    console.log("start rel times:", cycleStartTimes);
  }, [cycleStartTimes]);

  useEffect(() => {
    console.log("end rel times:", cycleEndTimes);
  }, [cycleEndTimes]);

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
}

export default Stopwatch;
