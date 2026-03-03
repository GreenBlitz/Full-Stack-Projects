// בס"ד
import type React from "react";
import { useMemo } from "react";
import { useMatchTimer } from "../hooks/useMatchTimer"; // adjust path

const MILLISECONDS_IN_A_SECOND = 1000;
const SECONDS_IN_A_MINUTE = 60;
const ITERATION_PERIOD_MS = 10
const DECIMAL_PLACES = 2;
const DECIMAL_PLACES_MILLISECONDS = 3;

interface StartMatchLocallyButtonProps {
  disabled: boolean;
}

const StartMatchLocallyButton: React.FC<StartMatchLocallyButtonProps> = ({
  disabled,
}) => {
  const { isRunning, elapsedMs, start, stop, reset } = useMatchTimer(ITERATION_PERIOD_MS);

  const formatTime = useMemo(() => {
    const minutes = Math.floor(elapsedMs / MILLISECONDS_IN_A_SECOND / SECONDS_IN_A_MINUTE);
    const seconds = Math.floor(elapsedMs / MILLISECONDS_IN_A_SECOND) % SECONDS_IN_A_MINUTE;
    const milliseconds = Math.floor(elapsedMs % MILLISECONDS_IN_A_SECOND);

    return `${String(minutes).padStart(DECIMAL_PLACES, "0")}:${String(seconds).padStart(
      DECIMAL_PLACES,
      "0",
    )}:${String(milliseconds).padStart(DECIMAL_PLACES_MILLISECONDS, "0")}`;
  }, [elapsedMs]);

  const handleClick = () => {
    if (disabled) return;
    if (isRunning) stop();
    else start();
  };

  return (
    <div className="flex flex-col items-center gap-2">
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
        {formatTime}
      </button>

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