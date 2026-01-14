// בס"ד
import { type FC, useState, useRef } from "react";
import type { TestProps } from "./TestPage";
import { useLocalStorage } from "./useLocalStorage";

const startingTimer = 0;
const TimeTest: FC<TestProps> = ({ setTest }) => {
  const [time, setTime] = useState<number>(startingTimer);
  const [isHolding, setIsHolding] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) return; // Prevent double intervals
    setIsHolding(true);

    timerRef.current = setInterval(() => {
      setTime((prev) => prev + 0.01); // Increment by 10ms
    }, 10);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsHolding(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm max-w-xs">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
          Total Hold Time
        </p>
        <div className="text-4xl font-mono font-bold text-slate-800">
          {time.toFixed(2)}s
        </div>
      </div>

      <button
        onMouseDown={startTimer}
        onMouseUp={stopTimer}
        onMouseLeave={stopTimer} // Stops timer if mouse drags off button
        onTouchStart={startTimer} // Support for mobile
        onTouchEnd={stopTimer}
        className={`
          relative h-32 w-32 rounded-full border-4 transition-all duration-200 flex items-center justify-center font-bold text-sm select-none
          ${
            isHolding
              ? "scale-90 bg-red-50 border-red-500 text-red-600 shadow-inner"
              : "bg-white border-blue-500 text-blue-600 shadow-lg hover:shadow-xl active:scale-95"
          }
        `}
      >
        {isHolding ? "HOLDING..." : "HOLD TO START"}
      </button>

      <button
        onClick={() => setTime(startingTimer)}
        className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-4"
      >
        Reset Timer
      </button>
    </div>
  );
};

export default TimeTest;
