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
  disabled: boolean;
}

const StartMatchLocallyButton: React.FC<StartMatchLocallyButtonProps> = ({
  disabled
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(INITIAL_TIME_MILLISECONDS);

  const startTimeRef = useRef(INITIAL_TIME_MILLISECONDS);

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
    startTimeRef.current = Date.now() - elapsedTime;
    setIsRunning(true);
  };

  const stop = () => {
    if (!isRunning) {
      return;
    }
    setIsRunning(false);
  };

    const handleClick = () => {
    if (disabled) return;

    if (isRunning) {
      stop();
    } else {
      start();
    }
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
  <div className="flex flex-col items-center gap-2">

    {/* Timer Button */}
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
        disabled
          ? "bg-gray-400 cursor-not-allowed"
          : isRunning
          ? "bg-blue-700"
          : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
      } text-black`}
    >
      {formatTime()}
    </button>

    {/* Reset Button */}
    <button
      onClick={reset}
      disabled={disabled}
      className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
        disabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
      } text-black`}
    >
      Reset
    </button>

  </div>
);
};

export default StartMatchLocallyButton;
