// בס"ד
import type React from "react";
import { useMemo } from "react";
import { useMatchTimer } from "../hooks/useMatchTimer"; // adjust path

const MILLISECONDS_IN_A_SECOND = 1000;
const SECONDS_IN_A_MINUTE = 60;
const ITERATION_PERIOD_MS = 10;
const DECIMAL_PLACES = 2;
const DECIMAL_PLACES_MILLISECONDS = 3;

interface StartMatchLocallyButtonProps {
  disabled: boolean;
}

const StartMatchLocallyButton: React.FC<StartMatchLocallyButtonProps> = ({
  disabled,
}) => {
  const { isRunning, elapsedMs, start, stop, reset } =
    useMatchTimer(ITERATION_PERIOD_MS);

  const formatTime = useMemo(() => {
    const minutes = Math.floor(
      elapsedMs / MILLISECONDS_IN_A_SECOND / SECONDS_IN_A_MINUTE,
    );
    const seconds =
      Math.floor(elapsedMs / MILLISECONDS_IN_A_SECOND) % SECONDS_IN_A_MINUTE;
    const milliseconds = Math.floor(elapsedMs % MILLISECONDS_IN_A_SECOND);

    return `${String(minutes).padStart(DECIMAL_PLACES, "0")}:${String(
      seconds,
    ).padStart(
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
        className={`px-10 py-5 text-2xl rounded-full font-bold tracking-wider
          transition-all duration-200 border-2
          ${
            disabled
              ? "bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed"
              : isRunning
                ? "bg-gradient-to-br from-green-900 to-black border-green-700 text-green-200 shadow-[0_0_25px_rgba(34,197,94,0.35)]"
                : "bg-gradient-to-br from-black via-green-950 to-black border-green-800 text-green-300 hover:scale-105 hover:border-green-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.45)] active:scale-95"
          }
        `}
      >
        {formatTime}
      </button>

      <button
        onClick={reset}
        disabled={disabled}
        className={`px-8 py-4 text-lg rounded-full font-semibold tracking-wide
          transition-all duration-200 border
          ${
            disabled
              ? "bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-black border-green-900 text-green-300 hover:border-green-600 hover:bg-green-950 hover:scale-105 active:scale-95"
          }
        `}
      >
        Reset
      </button>
    </div>
  );
};

export default StartMatchLocallyButton;
