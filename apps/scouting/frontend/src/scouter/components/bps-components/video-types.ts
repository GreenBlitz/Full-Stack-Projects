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

export interface YTPlayer {
  getCurrentTime(): number;
  getDuration(): number;
  getPlaybackRate(): number;
  setPlaybackRate(rate: number): void;
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  destroy(): void;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: {
      Player: new (
        elementId: string,
        config: {
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (event: { target: YTPlayer }) => void;
            onStateChange?: (event: { data: number }) => void;
          };
        },
      ) => YTPlayer;
    };
  }
}

export interface VideoProps {
  source: VideoSource;
  playerRef: React.RefObject<VideoPlayerHandle | null>;
  timestamps?: string[];
}
