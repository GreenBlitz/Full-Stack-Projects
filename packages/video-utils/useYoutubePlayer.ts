//בס"ד
import { useEffect, useRef } from "react";
import type React from "react";
import type { VideoPlayerHandle, VideoSource } from "./types";
import type { YouTubeWindow, YTPlayer } from "./youtube";
import { loadYouTubeAPI } from "./youtube";

const YT_PLAYING_STATE = 1;
const POLL_INTERVAL_MS = 250;
const PROGRESS_PERCENT_MAX = 100;

const YT_PLAYER_VARS = {
  autoplay: 1,
  controls: 0,
  modestbranding: 1,
  rel: 0,
} as const;

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

/** Creates a YouTube IFrame player instance */
const createYTPlayer = (
  win: YouTubeWindow,
  playerId: string,
  videoId: string,
  onReady: (e: { target: YTPlayer }) => void,
  onStateChange: (e: { data: number }) => void,
): YTPlayer =>
  new win.YT!.Player(playerId, {
    videoId,
    playerVars: YT_PLAYER_VARS,
    events: { onReady, onStateChange },
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
  const destroyedRef = useRef(false);

  useEffect(() => {
    if (source.type !== "youtube") return;

    destroyedRef.current = false;
    const win = window as YouTubeWindow;

    const initYT = async () => {
      await loadYouTubeAPI();
      if (destroyedRef.current || !win.YT || !ytContainerRef.current) return;

      const playerId = "yt-bps-player";
      const playerDiv = document.createElement("div");
      playerDiv.id = playerId;
      ytContainerRef.current.innerHTML = "";
      ytContainerRef.current.appendChild(playerDiv);

      createYTPlayer(win, playerId, source.videoId,
        (event) => {
          if (destroyedRef.current) {
            event.target.destroy();
            return;
          }
          ytPlayerRef.current = event.target;
          (playerRef as React.MutableRefObject<VideoPlayerHandle | null>).current =
            createYtHandle(event.target);

          pollIntervalRef.current = window.setInterval(() => {
            if (!ytPlayerRef.current) return;
            const current = ytPlayerRef.current.getCurrentTime();
            const dur = ytPlayerRef.current.getDuration();
            setCurrentTime(current);
            setDuration(dur);
            if (dur > 0) setProgress((current / dur) * PROGRESS_PERCENT_MAX);
          }, POLL_INTERVAL_MS);
        },
        (event) => setIsPlaying(event.data === YT_PLAYING_STATE),
      );
    };

    void initYT();

    return () => {
      destroyedRef.current = true;
      const id = pollIntervalRef.current;
      if (id != null) clearInterval(id);
      pollIntervalRef.current = null;
      ytPlayerRef.current?.destroy();
      ytPlayerRef.current = null;
      (playerRef as React.MutableRefObject<VideoPlayerHandle | null>).current = null;
    };
  }, [source, playerRef]);

  return { ytContainerRef };
};
