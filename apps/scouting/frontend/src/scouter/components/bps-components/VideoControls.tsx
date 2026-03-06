import type React from "react";
import { useRef } from "react";

const formatTime = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const PlayIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

const SkipBackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" />
  </svg>
);

const SkipFwdIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
  </svg>
);

interface VideoControlsProps {
  progress: number;
  isPlaying: boolean;
  speed: number;
  currentTime: number;
  duration: number;
  onTogglePlay: () => void;
  onSpeedChange: (s: number) => void;
  onJump: (seconds: number) => void;
  onSeek: (percent: number) => void;
}

const SPEEDS = [0.25, 0.5, 1] as const;

export const VideoControls: React.FC<VideoControlsProps> = ({
  progress,
  isPlaying,
  speed,
  currentTime,
  duration,
  onTogglePlay,
  onSpeedChange,
  onJump,
  onSeek,
}) => {
  const barRef = useRef<HTMLDivElement>(null);

  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = barRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const p = Math.max(0, Math.min(1, x / rect.width));
    onSeek(p);
  };

  const idx = SPEEDS.indexOf(speed);
  const nextSpeed = SPEEDS[idx >= 0 ? (idx + 1) % SPEEDS.length : 0];

  return (
    <div className="w-full max-w-[640px] min-[2001px]:w-[640px] mx-auto mt-2 rounded-xl bg-slate-900/80 border border-white/10 p-3">
      <div
        ref={barRef}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-full bg-slate-700 rounded-full overflow-hidden cursor-pointer mb-3 group"
        onClick={handleBarClick}
      >
        <div
          className="h-full bg-emerald-500 rounded-full transition-[width] duration-75 group-hover:bg-emerald-400"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            className="w-11 h-11 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-colors shadow-lg shadow-emerald-900/30"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button
            onClick={() => onJump(-5)}
            className="w-10 h-10 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center justify-center transition-colors"
            aria-label="Back 5 seconds"
          >
            <SkipBackIcon />
          </button>
          <button
            onClick={() => onJump(5)}
            className="w-10 h-10 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center justify-center transition-colors"
            aria-label="Forward 5 seconds"
          >
            <SkipFwdIcon />
          </button>
        </div>

        <span className="text-sm text-slate-400 tabular-nums min-w-[100px] text-right">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        <button
          onClick={() => onSpeedChange(nextSpeed)}
          className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-semibold transition-colors"
        >
          {speed}×
        </button>
      </div>
    </div>
  );
};
