//בס"ד
import type React from "react";
import { useState } from "react";
import type { VideoSource } from "./video-types";
import { extractYouTubeId } from "./video-utils";

const BPS_YT_URL_KEY = "bps-youtube-url";

interface VideoSourceSelectorProps {
  onVideoSourceSelected: (source: VideoSource) => void;
}

export const VideoSourceSelector: React.FC<VideoSourceSelectorProps> = ({
  onVideoSourceSelected,
}) => {
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
      onVideoSourceSelected({ type: "youtube", videoId });
    } else {
      setUrlError(true);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onVideoSourceSelected({ type: "file", src: URL.createObjectURL(file) });
    }
  };

  return (
    <div className="max-w-[480px] mx-auto w-full flex flex-col gap-6 p-8 bg-slate-900/40 rounded-2xl border border-white/10 backdrop-blur-md">
      <h2 className="text-xl font-bold text-white">Choose video source</h2>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-400">
          YouTube link:
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
            Load
          </button>
        </div>
        {urlError && (
          <span className="text-xs text-rose-500">Invalid link</span>
        )}
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-white/5" />
        <span className="text-sm text-slate-500">or</span>
        <div className="flex-1 h-px bg-white/5" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-400">
          Upload video file:
        </label>
        <input
          type="file"
          accept="video/*"
          onChange={handleFileUpload}
          className="w-full px-3 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-slate-300 text-sm cursor-pointer file:mr-3 file:py-1.5 file:px-3 file:bg-slate-800 file:border file:border-white/10 file:rounded-lg file:text-slate-300 file:cursor-pointer file:text-sm"
        />
      </div>
    </div>
  );
};
