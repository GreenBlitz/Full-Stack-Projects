//בס"ד
import { useRef, useState } from "react";
import { Video } from "./Video";
import Counter from "./Counter";
import type { VideoPlayerHandle, VideoSource } from "@repo/video-utils";
import { VideoSourceSelector } from "./VideoSourceSelector";

function App() {
  const playerRef = useRef<VideoPlayerHandle | null>(null);
  const [videoSource, setVideoSource] = useState<VideoSource | null>(null);

  if (!videoSource) {
    return (
      <div className="flex flex-col gap-8 p-8 bg-slate-950 min-h-screen text-slate-200">
        <VideoSourceSelector onVideoSourceSelected={setVideoSource} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-8 bg-slate-950 min-h-screen text-slate-200">
      <div className="max-w-[1280px] mx-auto w-full flex flex-col items-center">
        <button
          onClick={() => setVideoSource(null)}
          className="self-start mb-4 px-4 py-2 bg-transparent text-slate-400 border border-white/10 rounded-xl text-sm hover:text-white hover:border-white/20 transition-colors"
        >
          ← Change video
        </button>
        <div className="inline-block text-center w-full">
          <Video source={videoSource} playerRef={playerRef} />
        </div>
        <Counter playerRef={playerRef} />
      </div>
    </div>
  );
}

export default App;
