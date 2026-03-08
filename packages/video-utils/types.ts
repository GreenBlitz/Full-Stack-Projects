//בס"ד
import type React from "react";

export interface VideoPlayerHandle {
  currentTime: number;
  duration: number;
  playbackRate: number;
  play(): void | Promise<void>;
  pause(): void;
}

export type VideoSource =
  | { type: "file"; src: string }
  | { type: "youtube"; videoId: string };
