//בס"ד
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
