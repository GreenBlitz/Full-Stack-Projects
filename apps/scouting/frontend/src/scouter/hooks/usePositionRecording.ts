// בס"ד
import { useRef, useEffect, useCallback } from "react";
import type { Point } from "@repo/scouting_types";
import { defaultPoint } from "../components/ScoreMap";

const DEFAULT_RECORDING_INTERVAL_MS = 1000;

export const usePositionRecording = (
  currentPosition: Point | undefined,
  recordingIntervalMs: number = DEFAULT_RECORDING_INTERVAL_MS,
): {
  recordedPositionsRef: { current: Point[] };
  start: () => void;
  stop: () => void;
} => {
  const recordedPositionsRef = useRef<Point[]>([]);
  const positionIntervalRef = useRef<number | null>(null);
  const currentPositionRef = useRef<Point | undefined>(undefined);

  useEffect(() => {
    currentPositionRef.current = currentPosition;
  }, [currentPosition]);

  const start = useCallback(() => {
    if (positionIntervalRef.current !== null) {
      clearInterval(positionIntervalRef.current);
    }
    recordedPositionsRef.current = [];
    const initialPosition = currentPositionRef.current ?? { ...defaultPoint };
    recordedPositionsRef.current.push(initialPosition);

    positionIntervalRef.current = window.setInterval(() => {
      const currentPos = currentPositionRef.current ?? { ...defaultPoint };
      recordedPositionsRef.current.push(currentPos);
    }, recordingIntervalMs);
  }, [recordingIntervalMs]);

  const stop = useCallback(() => {
    if (positionIntervalRef.current === null) return;
    clearInterval(positionIntervalRef.current);
    positionIntervalRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      if (positionIntervalRef.current === null) return;
      clearInterval(positionIntervalRef.current);
    };
  }, []);

  return { recordedPositionsRef, start, stop };
};
