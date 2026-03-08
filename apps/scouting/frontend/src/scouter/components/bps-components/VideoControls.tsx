//בס"ד
import type React from "react";
import { useRef } from "react";
import { IoPlay, IoPause, IoPlaySkipBack, IoPlaySkipForward } from "react-icons/io5";

const PLAY_PAUSE_ICON_SIZE = 18;
const SKIP_ICON_SIZE = 16;
const SECONDS_PER_MINUTE = 60;
const SECONDS_DISPLAY_PADDING = 2;
const SEEK_JUMP_SECONDS = 5;
const PROGRESS_MIN = 0;
const PROGRESS_MAX = 1;
const PROGRESS_PERCENT_MAX = 100;

const formatTime = (totalSeconds: number): string => {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0:00";
  const minutes = Math.floor(totalSeconds / SECONDS_PER_MINUTE);
  const seconds = Math.floor(totalSeconds % SECONDS_PER_MINUTE);
  return `${minutes}:${seconds.toString().padStart(SECONDS_DISPLAY_PADDING, "0")}`;
};

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
    const clickOffsetFromLeft = e.clientX - rect.left;
    const seekPercent = Math.max(
      PROGRESS_MIN,
      Math.min(PROGRESS_MAX, clickOffsetFromLeft / rect.width),
    );
    onSeek(seekPercent);
  };

  const idx = SPEEDS.indexOf(speed as (typeof SPEEDS)[number]);
  const nextSpeed = SPEEDS[idx >= 0 ? (idx + 1) % SPEEDS.length : 0];

  return (
    <div className="w-full max-w-[640px] min-[2001px]:w-[640px] mx-auto mt-2 rounded-xl bg-slate-900/80 border border-white/10 p-3">
      <div
        ref={barRef}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={PROGRESS_MIN}
        aria-valuemax={PROGRESS_PERCENT_MAX}
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
            {isPlaying ? <IoPause size={PLAY_PAUSE_ICON_SIZE} /> : <IoPlay size={PLAY_PAUSE_ICON_SIZE} />}
          </button>
          <button
            onClick={() => onJump(-SEEK_JUMP_SECONDS)}
            className="w-10 h-10 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center justify-center transition-colors"
            aria-label={`Back ${SEEK_JUMP_SECONDS} seconds`}
          >
            <IoPlaySkipBack size={SKIP_ICON_SIZE} />
          </button>
          <button
            onClick={() => onJump(SEEK_JUMP_SECONDS)}
            className="w-10 h-10 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center justify-center transition-colors"
            aria-label={`Forward ${SEEK_JUMP_SECONDS} seconds`}
          >
            <IoPlaySkipForward size={SKIP_ICON_SIZE} />
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
