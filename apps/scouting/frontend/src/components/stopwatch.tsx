import React, { useState, useEffect, useRef } from "react";

function Stopwatch() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const intervalIdRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);

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
    if (!isRunning) {
      startTimeRef.current = Date.now() - elapsedTime;
      setIsRunning(true);
    }
  }

  function stop() {
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

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      {/* Timer display */}
      <div
        className={`
          select-none
          cursor-pointer
          rounded-2xl
          px-10 py-6
          text-4xl font-mono font-semibold
          shadow-lg
          transition-all duration-150
          ${
            isRunning
              ? "bg-emerald-500 text-white scale-95"
              : "bg-slate-800 text-emerald-400 hover:bg-slate-700"
          }
        `}
        onMouseDown={start}
        onMouseUp={stop}
        onMouseLeave={stop}
        onTouchStart={start}
        onTouchEnd={stop}
      >
        {formatTime()}
      </div>

      {/* Reset button */}
      <button
        onClick={reset}
        className="
            rounded-lg
            px-4 py-1.5
            text-sm font-medium
            text-slate-600
            border border-slate-300
            hover:bg-slate-100
            hover:text-slate-800
            active:scale-95
            transition
            "
            >
            Reset
        </button>

    </div>
  );
}

export default Stopwatch;
