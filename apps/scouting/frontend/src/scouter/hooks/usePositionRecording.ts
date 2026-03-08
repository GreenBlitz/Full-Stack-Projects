// בס"ד
/**
 * Hook for recording robot positions during a shooting cycle.
 * Used to track movement while shooting (shooting-while-moving feature).
 *
 * Records positions at regular intervals between start() and stop() calls,
 * allowing analysis of robot trajectory during each shot.
 */
import { useRef, useEffect } from "react";
import type { Point } from "@repo/scouting_types";
import { defaultPoint } from "../components/ScoreMap";

interface PositionRecordingResult {
  /** Ref containing all recorded positions. Reset on each start(). */
  recordedPositionsRef: { current: Point[] };
  /** Begin recording positions at the configured interval. */
  start: () => void;
  /** Stop recording positions. */
  stop: () => void;
}

const DEFAULT_RECORDING_INTERVAL_MS = 1000;

export const usePositionRecording = (
  currentPosition: Point | undefined,
  recordingIntervalMs: number = DEFAULT_RECORDING_INTERVAL_MS,
): PositionRecordingResult => {
  const recordedPositionsRef = useRef<Point[]>([]);
  const positionIntervalRef = useRef<number | null>(null);
  const currentPositionRef = useRef<Point | undefined>(undefined);
  const recordingIntervalRef = useRef(recordingIntervalMs);

  useEffect(() => {
    currentPositionRef.current = currentPosition;
  }, [currentPosition]);

  useEffect(() => {
    recordingIntervalRef.current = recordingIntervalMs;
  }, [recordingIntervalMs]);

  const startRef = useRef(() => {
    if (positionIntervalRef.current !== null) {
      clearInterval(positionIntervalRef.current);
    }

    recordedPositionsRef.current = [];
    const initialPosition = currentPositionRef.current ?? { ...defaultPoint };
    recordedPositionsRef.current.push(initialPosition);

    positionIntervalRef.current = window.setInterval(() => {
      const currentPos = currentPositionRef.current ?? { ...defaultPoint };
      recordedPositionsRef.current.push(currentPos);
    }, recordingIntervalRef.current);
  });

  const stopRef = useRef(() => {
    if (positionIntervalRef.current === null) return;
    clearInterval(positionIntervalRef.current);
    positionIntervalRef.current = null;
  });

  useEffect(() => {
    return () => {
      if (positionIntervalRef.current === null) return;
      clearInterval(positionIntervalRef.current);
    };
  }, []);

  return {
    recordedPositionsRef,
    start: startRef.current,
    stop: stopRef.current,
  };
};
