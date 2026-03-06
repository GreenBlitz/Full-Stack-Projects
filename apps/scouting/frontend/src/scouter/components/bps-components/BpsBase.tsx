//בס"ד
import { useRef, useState } from "react";
import Video, { extractYouTubeId } from "./Video";
import Counter from "./Counter";
import type { VideoPlayerHandle, VideoSource } from "./Video";

const BPS_YT_URL_KEY = "bps-youtube-url";

function app() {
  const playerRef = useRef<VideoPlayerHandle | null>(null);

  const [videoSource, setVideoSource] = useState<VideoSource | null>(null);
  const [urlInput, setUrlInput] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(BPS_YT_URL_KEY) ?? "";
  });
  const [urlError, setUrlError] = useState(false);

  const handleYouTubeUrl = () => {
    const trimmed = urlInput.trim();
    const videoId = extractYouTubeId(trimmed);
    if (videoId) {
      setUrlError(false);
      localStorage.setItem(BPS_YT_URL_KEY, trimmed);
      setVideoSource({ type: "youtube", videoId });
    } else {
      setUrlError(true);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoSource({ type: "file", src: URL.createObjectURL(file) });
    }
  };

  if (!videoSource) {
    return (
      <div className="flex flex-col gap-8 p-8 bg-slate-950 min-h-screen text-slate-200">
        <div className="max-w-[480px] mx-auto w-full flex flex-col gap-6 p-8 bg-slate-900/40 rounded-2xl border border-white/10 backdrop-blur-md text-right" dir="rtl">
          <h2 className="text-xl font-bold text-white">
            בחר מקור וידאו
          </h2>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-400">
              קישור YouTube:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  setUrlError(false);
                }}
                placeholder="https://www.youtube.com/watch?v=..."
                className="flex-1 px-3 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none transition-colors"
                dir="ltr"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleYouTubeUrl();
                }}
              />
              <button
                onClick={handleYouTubeUrl}
                className="px-5 py-2.5 bg-emerald-500 text-slate-950 font-bold text-sm rounded-xl hover:bg-emerald-400 transition-colors"
              >
                טען
              </button>
            </div>
            {urlError && (
              <span className="text-xs text-rose-500">קישור לא תקין</span>
            )}
          </div>

          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-sm text-slate-500">או</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-400">
              העלה קובץ וידאו:
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              className="w-full px-3 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-slate-300 text-sm cursor-pointer file:mr-3 file:py-1.5 file:px-3 file:bg-slate-800 file:border file:border-white/10 file:rounded-lg file:text-slate-300 file:cursor-pointer file:text-sm"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-8 bg-slate-950 min-h-screen text-slate-200">
      <div className="max-w-[1280px] mx-auto w-full flex flex-col items-center">
        <button
          onClick={() => {
            setVideoSource(null);
            setUrlInput(localStorage.getItem(BPS_YT_URL_KEY) ?? "");
            setUrlError(false);
          }}
          className="self-start mb-4 px-4 py-2 bg-transparent text-slate-400 border border-white/10 rounded-xl text-sm hover:text-white hover:border-white/20 transition-colors"
        >
          ← החלף וידאו
        </button>
        <div className="inline-block text-center w-full">
          <Video source={videoSource} playerRef={playerRef} />
        </div>
        <Counter playerRef={playerRef} />
      </div>
    </div>
  );
}

export default app;
