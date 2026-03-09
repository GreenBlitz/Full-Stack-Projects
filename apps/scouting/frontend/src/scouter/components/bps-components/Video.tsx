//בס"ד
import { useEffect, useRef, useState } from "react";
import type React from "react";
import type { VideoPlayerHandle, VideoSource } from "@repo/video-utils";
import { useYoutubePlayer } from "@repo/video-utils";
import { VideoControls } from "./VideoControls";

interface VideoProps {
  source: VideoSource;
  playerRef: React.RefObject<VideoPlayerHandle | null>;
  timestamps?: string[];
}

const PROGRESS_PERCENT_MAX = 100;
const DEFAULT_PLAYBACK_SPEED = 1;

const Video: React.FC<VideoProps> = ({ source, playerRef }) => {
  const htmlVideoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(DEFAULT_PLAYBACK_SPEED);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const { ytContainerRef } = useYoutubePlayer(
    source,
    playerRef,
    setProgress,
    setIsPlaying,
    setCurrentTime,
    setDuration,
  );

  useEffect(() => {
    if (source.type !== "file") return;
    const el = htmlVideoRef.current;
    if (el) {
      (playerRef as React.MutableRefObject<VideoPlayerHandle | null>).current =
        el;
    }
  }, [source, playerRef]);

  const updateProgress = () => {
    const el = source.type === "file" ? htmlVideoRef.current : null;
    if (!el) return;
    setProgress((el.currentTime / el.duration) * PROGRESS_PERCENT_MAX);
    setCurrentTime(el.currentTime);
    setDuration(el.duration);
  };

  const jumpTime = (seconds: number) => {
    if (playerRef.current) playerRef.current.currentTime += seconds;
  };

  const handleSeek = (percent: number) => {
    if (!playerRef.current) return;
    const { duration } = playerRef.current;
    if (Number.isFinite(duration) && duration > 0) {
      playerRef.current.currentTime = percent * duration;
    }
  };

  return (
    <>
      {source.type === "file" ? (
        <video
          className="w-full max-w-[640px] h-auto min-[2001px]:w-[640px] min-[2001px]:h-[400px] block mx-auto rounded-lg overflow-hidden"
          ref={htmlVideoRef}
          autoPlay
          muted
          playsInline
          onTimeUpdate={updateProgress}
          onLoadedMetadata={(e) => {
            setDuration(e.currentTarget.duration);
          }}
        >
          <source src={source.src} type="video/mp4" />
        </video>
      ) : (
        <div
          className="w-full max-w-[640px] aspect-video bg-black rounded-lg mx-auto min-[2001px]:w-[640px] min-[2001px]:h-[400px] min-[2001px]:aspect-auto overflow-hidden [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
          ref={ytContainerRef}
        />
      )}

      <VideoControls
        progress={progress}
        isPlaying={isPlaying}
        speed={speed}
        currentTime={currentTime}
        duration={duration}
        onTogglePlay={() => {
          const player = playerRef.current;
          if (!player) return;
          if (isPlaying) player.pause();
          else void player.play();
          setIsPlaying(!isPlaying);
        }}
        onSpeedChange={(s) => {
          setSpeed(s);
          if (playerRef.current) playerRef.current.playbackRate = s;
        }}
        onJump={jumpTime}
        onSeek={handleSeek}
      />
    </>
  );
};

export { Video };
