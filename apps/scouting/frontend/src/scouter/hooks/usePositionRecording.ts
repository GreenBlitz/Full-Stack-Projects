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

/**
 * Records the current position at regular intervals while active.
 * @param currentPosition - The current position on the field map (updated by user interaction)
 * @param recordingIntervalMs - How often to sample the position (default: 1000ms)
 * @returns Controls and ref for position recording
 */
export const usePositionRecording = (
  currentPosition: Point | undefined,
  recordingIntervalMs: number = DEFAULT_RECORDING_INTERVAL_MS,
): PositionRecordingResult => {
  const recordedPositionsRef = useRef<Point[]>([]);
  const positionIntervalRef = useRef<number | null>(null);
  // Ref to access current position inside interval callback without stale closure
  const currentPositionRef = useRef<Point | undefined>(undefined);
  // Store recording interval in ref for stable access
  const recordingIntervalRef = useRef(recordingIntervalMs);

  // Sync refs whenever props change
  useEffect(() => {
    currentPositionRef.current = currentPosition;
  }, [currentPosition]);

  useEffect(() => {
    recordingIntervalRef.current = recordingIntervalMs;
  }, [recordingIntervalMs]);

  // Stable function refs that never change identity
  const startRef = useRef(() => {
    // Clear any existing interval to avoid duplicates
    if (positionIntervalRef.current !== null) {
      clearInterval(positionIntervalRef.current);
    }

    // Reset recorded positions and capture initial position immediately
    recordedPositionsRef.current = [];
    const initialPosition = currentPositionRef.current ?? { ...defaultPoint };
    recordedPositionsRef.current.push(initialPosition);

    // Sample position at regular intervals
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

  // Cleanup interval on unmount
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
