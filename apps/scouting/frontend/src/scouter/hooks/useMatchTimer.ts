// בס"ד
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "match-timer";

type TimerState = {
  isRunning: boolean;
  startTime: number | null;      // absolute timestamp when started
  elapsedBeforeStart: number;    // ms accumulated before last start (for pause/resume)
};

const DEFAULT_STATE: TimerState = {
  isRunning: false,
  startTime: null,
  elapsedBeforeStart: 0,
};

function readState(): TimerState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_STATE;

  try {
    const parsed = JSON.parse(raw) as Partial<TimerState>;
    return {
      isRunning: Boolean(parsed.isRunning),
      startTime: typeof parsed.startTime === "number" ? parsed.startTime : null,
      elapsedBeforeStart:
        typeof parsed.elapsedBeforeStart === "number" ? parsed.elapsedBeforeStart : 0,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function writeState(next: TimerState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  // Make same-tab components update immediately too:
  window.dispatchEvent(new Event("match-timer-updated"));
}

export function useMatchTimer(tickMs = 10) {
  const [state, setState] = useState<TimerState>(() => readState());
  const [now, setNow] = useState(() => Date.now());

  // Listen for cross-tab updates + same-tab custom event
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      setState(readState());
    };
    const onLocal = () => setState(readState());

    window.addEventListener("storage", onStorage);
    window.addEventListener("match-timer-updated", onLocal);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("match-timer-updated", onLocal);
    };
  }, []);

  // Ticking only used to cause re-render so elapsed updates in UI
  useEffect(() => {
    if (!state.isRunning) return;

    const id = window.setInterval(() => {setNow(Date.now())}, tickMs);
    return () => window.clearInterval(id);
  }, [state.isRunning, tickMs]);

  const elapsedMs = useMemo(() => {
    if (!state.isRunning || state.startTime === null) {
      return state.elapsedBeforeStart;
    }
    return state.elapsedBeforeStart + (now - state.startTime);
  }, [state, now]);

  const start = () => {
    const cur = readState();
    if (cur.isRunning) return;

    const next: TimerState = {
      isRunning: true,
      startTime: Date.now(),
      elapsedBeforeStart: cur.elapsedBeforeStart,
    };
    writeState(next);
    setState(next);
  };

  const stop = () => {
    const cur = readState();
    if (!cur.isRunning || cur.startTime === null) return;

    const nextElapsed = cur.elapsedBeforeStart + (Date.now() - cur.startTime);

    const next: TimerState = {
      isRunning: false,
      startTime: null,
      elapsedBeforeStart: nextElapsed,
    };
    writeState(next);
    setState(next);
  };

  const reset = () => {
    writeState(DEFAULT_STATE);
    setState(DEFAULT_STATE);
    setNow(Date.now());
  };

  return { isRunning: state.isRunning, elapsedMs, start, stop, reset };
}