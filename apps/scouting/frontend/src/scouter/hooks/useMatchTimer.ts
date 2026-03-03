// בס"ד
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "match-timer";

interface TimerState {
  isRunning: boolean;
  startTime: number | null;
  elapsedBeforeStart: number;
}

const defaultState: TimerState = {
  isRunning: false,
  startTime: null,
  elapsedBeforeStart: 0,
};

const readState = (): TimerState => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultState;

  try {
    const parsed = JSON.parse(raw) as Partial<TimerState>;
    return {
      isRunning: Boolean(parsed.isRunning),
      startTime:
        typeof parsed.startTime === "number"
          ? parsed.startTime
          : defaultState.startTime,
      elapsedBeforeStart:
        typeof parsed.elapsedBeforeStart === "number"
          ? parsed.elapsedBeforeStart
          : defaultState.elapsedBeforeStart,
    };
  } catch {
    return defaultState;
  }
};

const writeState = (next: TimerState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("match-timer-updated"));
};

const ITERATION_PERIOD_MS = 10;

export const useMatchTimer = (tickMs = ITERATION_PERIOD_MS) => {
  const [state, setState] = useState<TimerState>(() => readState());
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      setState(readState());
    };
    const onLocal = () => {
      setState(readState());
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("match-timer-updated", onLocal);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("match-timer-updated", onLocal);
    };
  }, []);

  useEffect(() => {
    if (!state.isRunning) return undefined;

    const id = window.setInterval(() => {
      setNow(Date.now());
    }, tickMs);
    return () => {
      window.clearInterval(id);
    };
  }, [state.isRunning, tickMs]);

  const elapsedMs = useMemo(() => {
    if (!state.isRunning || state.startTime === null) {
      return state.elapsedBeforeStart;
    }
    return state.elapsedBeforeStart + (now - state.startTime);
  }, [state, now]);

  const start = () => {
    const current = readState();
    if (current.isRunning) return;

    const next: TimerState = {
      isRunning: true,
      startTime: Date.now(),
      elapsedBeforeStart: current.elapsedBeforeStart,
    };
    writeState(next);
    setState(next);
  };

  const stop = () => {
    const current = readState();
    if (!current.isRunning || current.startTime === null) return;

    const nextElapsed =
      current.elapsedBeforeStart + (Date.now() - current.startTime);

    const next: TimerState = {
      isRunning: false,
      startTime: null,
      elapsedBeforeStart: nextElapsed,
    };
    writeState(next);
    setState(next);
  };

  const reset = () => {
    writeState(defaultState);
    setState(defaultState);
    setNow(Date.now());
  };

  return { isRunning: state.isRunning, elapsedMs, start, stop, reset };
};
