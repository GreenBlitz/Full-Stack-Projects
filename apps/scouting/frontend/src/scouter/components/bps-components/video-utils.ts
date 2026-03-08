//בס"ד
const SECONDS_PER_MINUTE = 60;
const TIME_PARTS_MM_SS = 2;

export const convertToSecs = (time: string): number => {
  const parts = time.split(":").map(Number);
  if (parts.length === TIME_PARTS_MM_SS) {
    return parts[0] * SECONDS_PER_MINUTE + parts[1];
  }
  return 0;
};

const YOUTUBE_VIDEO_ID_LENGTH = 11;
const YOUTUBE_ID_REGEX = new RegExp(
  `(?:youtube\\.com/watch\\?v=|youtu\\.be/|youtube\\.com/embed/)([a-zA-Z0-9_-]{${YOUTUBE_VIDEO_ID_LENGTH}})`,
);

/** Extracts video ID from youtube.com/watch, youtu.be, or embed URLs */
export const extractYouTubeId = (url: string): string | null => {
  const match = url.match(YOUTUBE_ID_REGEX);
  return match?.[1] ?? null;
};

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

export type YouTubeWindow = typeof window & {
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
};

const YT_READY_POLL_INTERVAL_MS = 100;

/** Loads YouTube IFrame API script if missing; resolves when window.YT is ready */
export const loadYouTubeAPI = (): Promise<void> => {
  const win = window as YouTubeWindow;
  if (win.YT) return Promise.resolve();
  return new Promise((resolve) => {
    const existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]',
    );
    if (existingScript) {
      const check = setInterval(() => {
        if (win.YT) {
          clearInterval(check);
          resolve();
        }
      }, YT_READY_POLL_INTERVAL_MS);
      return;
    }
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const previousCallback = win.onYouTubeIframeAPIReady;
    win.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve();
    };
    document.head.appendChild(tag);
  });
};
