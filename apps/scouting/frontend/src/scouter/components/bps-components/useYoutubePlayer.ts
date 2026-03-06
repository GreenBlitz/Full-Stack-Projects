//בס"ד
import { useEffect, useRef } from "react";
import type React from "react";
import type { VideoPlayerHandle, VideoSource, YTPlayer } from "./video-types";
import { loadYouTubeAPI } from "./video-utils";

const YT_PLAYING_STATE = 1;
const POLL_INTERVAL_MS = 250;

/** Wraps YT player in VideoPlayerHandle interface so HTML5 and YT use same API */
const createYtHandle = (target: YTPlayer): VideoPlayerHandle => ({
  get currentTime() {
    return target.getCurrentTime();
  },
  set currentTime(v: number) {
    target.seekTo(v, true);
  },
  get duration() {
    return target.getDuration();
  },
  get playbackRate() {
    return target.getPlaybackRate();
  },
  set playbackRate(v: number) {
    target.setPlaybackRate(v);
  },
  play() {
    target.playVideo();
  },
  pause() {
    target.pauseVideo();
  },
});

/** Loads YT API, mounts player in container, wires progress/playback state; cleanup on unmount */
export const useYoutubePlayer = (
  source: VideoSource,
  playerRef: React.RefObject<VideoPlayerHandle | null>,
  setProgress: (p: number) => void,
  setIsPlaying: (p: boolean) => void,
  setCurrentTime: (t: number) => void,
  setDuration: (d: number) => void,
) => {
  const ytPlayerRef = useRef<YTPlayer | null>(null);
  const ytContainerRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (source.type !== "youtube") return;

    let destroyed = false;

    const initYT = async () => {
      await loadYouTubeAPI();
      if (destroyed || !window.YT || !ytContainerRef.current) return;

      const playerId = "yt-bps-player";
      const playerDiv = document.createElement("div");
      playerDiv.id = playerId;
      ytContainerRef.current.innerHTML = "";
      ytContainerRef.current.appendChild(playerDiv);

      new window.YT!.Player(playerId, {
        videoId: source.videoId,
        playerVars: { autoplay: 1, controls: 0, modestbranding: 1, rel: 0 },
        events: {
          onReady: (event) => {
            if (destroyed) {
              event.target.destroy();
              return;
            }
            ytPlayerRef.current = event.target;
            (playerRef as React.MutableRefObject<VideoPlayerHandle | null>).current = createYtHandle(
              event.target,
            );

            pollIntervalRef.current = window.setInterval(() => {
              if (!ytPlayerRef.current) return;
              const current = ytPlayerRef.current.getCurrentTime();
              const dur = ytPlayerRef.current.getDuration();
              setCurrentTime(current);
              setDuration(dur);
              if (dur > 0) setProgress((current / dur) * 100);
            }, POLL_INTERVAL_MS);
          },
          onStateChange: (event) => {
            setIsPlaying(event.data === YT_PLAYING_STATE);
          },
        },
      });
    };

    void initYT();

    return () => {
      destroyed = true;
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      if (ytPlayerRef.current) {
        ytPlayerRef.current.destroy();
        ytPlayerRef.current = null;
      }
      (playerRef as React.MutableRefObject<VideoPlayerHandle | null>).current = null;
    };
  }, [source, playerRef]);

  return { ytContainerRef };
};
