//בס"ד
const SECONDS_PER_MINUTE = 60;
const TIME_PARTS_MM_SS = 2;
const SECONDS_DISPLAY_PADDING = 2;

/** Formats total seconds as "m:ss" (e.g. 90 → "1:30") */
export const formatDuration = (totalSeconds: number): string => {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0:00";
  const minutes = Math.floor(totalSeconds / SECONDS_PER_MINUTE);
  const seconds = Math.floor(totalSeconds % SECONDS_PER_MINUTE);
  return `${minutes}:${seconds.toString().padStart(SECONDS_DISPLAY_PADDING, "0")}`;
};

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
