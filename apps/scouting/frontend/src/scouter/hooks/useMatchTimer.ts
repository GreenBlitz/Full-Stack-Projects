// בס"ד
import { useLocalStorage } from "@repo/local_storage_hook";
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "match-timer";

interface TimerState {
  isRunning: boolean;
  startTime: number | null;
  elapsedBeforeStart: number;
}

const defaultTimer: TimerState = {
  isRunning: false,
  startTime: null,
  elapsedBeforeStart: 0,
};

const ITERATION_PERIOD_MS = 10;

export const useMatchTimer = (tickMs = ITERATION_PERIOD_MS) => {
  const [timeState, setTimeState] = useLocalStorage<TimerState>(
    STORAGE_KEY,
    defaultTimer,
  );
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!timeState.isRunning) return undefined;

    const id = window.setInterval(() => {
      setNow(Date.now());
    }, tickMs);
    return () => {
      window.clearInterval(id);
    };
  }, [timeState.isRunning, tickMs]);

  const elapsedMs = useMemo(() => {
    if (!timeState.isRunning || timeState.startTime === null) {
      return timeState.elapsedBeforeStart;
    }
    return timeState.elapsedBeforeStart + (now - timeState.startTime);
  }, [timeState, now]);

  const start = () => {
    if (timeState.isRunning) return;

    const next: TimerState = {
      isRunning: true,
      startTime: Date.now(),
      elapsedBeforeStart: timeState.elapsedBeforeStart,
    };
    setTimeState(next);
  };

  const stop = () => {
    if (!timeState.isRunning || timeState.startTime === null) return;

    const nextElapsed =
      timeState.elapsedBeforeStart + (Date.now() - timeState.startTime);

    const next: TimerState = {
      isRunning: false,
      startTime: null,
      elapsedBeforeStart: nextElapsed,
    };
    setTimeState(next);
  };

  const reset = () => {
    setTimeState(defaultTimer);
    setNow(Date.now());
  };

  return { isRunning: timeState.isRunning, elapsedMs, start, stop, reset };
};
