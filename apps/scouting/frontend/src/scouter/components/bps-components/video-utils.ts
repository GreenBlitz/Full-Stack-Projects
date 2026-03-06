//בס"ד
export const convertToSecs = (time: string): number => {
  const parts = time.split(":").map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
};

/** Extracts video ID from youtube.com/watch, youtu.be, or embed URLs */
export const extractYouTubeId = (url: string): string | null => {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  );
  return match?.[1] ?? null;
};

/** Loads YouTube IFrame API script if missing; resolves when window.YT is ready */
export const loadYouTubeAPI = (): Promise<void> => {
  if (window.YT) return Promise.resolve();
  return new Promise((resolve) => {
    const existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]',
    );
    if (existingScript) {
      const check = setInterval(() => {
        if (window.YT) {
          clearInterval(check);
          resolve();
        }
      }, 100);
      return;
    }
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve();
    };
    document.head.appendChild(tag);
  });
};
