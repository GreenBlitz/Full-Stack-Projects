// בס"ד

import React, { useEffect, useRef, useState } from "react";
import type { FC } from "react";

import type { TestProps } from "./TestPage";
import type { BPMInterval } from "../../../common/types/Tests";

export const BPMTest: FC<TestProps> = ({ setTest }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [marks, setMarks] = useState<Timestamp[]>([]);
  const [intervals, setIntervals] = useState<BPMInterval[]>([]);

  useEffect(() => {
    setMarks([]);
    setTest({ intervals });
  }, [intervals]);

  const handleCapture = () => {
    if (videoRef.current) {
      const { currentTime } = videoRef.current;
      setMarks([...marks, { id: Date.now(), time: currentTime }]);
    }
  };

  const jumpToFirst = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = marks[0].time;
      videoRef.current.play();
    }
  };

  const endInterval = () => {
    if (!videoRef.current) {
      return;
    }
    const { currentTime } = videoRef.current;
    setIntervals((prev) => [
      ...prev,
      {
        time: currentTime,
        scores: marks.map((mark) => mark.time),
      },
    ]);
  };

  const removeStamp = (id: number) => {
    setMarks((prev) => prev.filter((stamp) => stamp.id !== id));
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    const milliseconds = Math.floor((totalSeconds % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, "0")}:${milliseconds}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-50 rounded-3xl shadow-inner border border-slate-200">
      <div className="flex flex-col gap-6">
        {/* Video Player */}
        <div className="relative group overflow-hidden rounded-2xl bg-black shadow-2xl border-4 border-white">
          <video
            ref={videoRef}
            controls
            className="w-full aspect-video"
            src="/2017-m1.mp4"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleCapture}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="text-xl">⏱️</span>
            Add Fuel
          </button>

          <div className="bg-white px-6 py-4 rounded-xl border border-slate-200 font-mono font-bold text-slate-600">
            Total: {marks.length}
          </div>
        </div>

        {/* Timestamp Gallery */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {marks.map((mark) => (
            <button
              key={mark.id}
              onClick={() => {
                removeStamp(mark.id);
              }}
              className="group p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-500 hover:ring-2 hover:ring-blue-200 transition-all text-left relative overflow-hidden"
            >
              <div className="text-lg font-mono font-bold text-yellow-500">
                {formatTime(mark.time)}
              </div>
            </button>
          ))}
        </div>

        {marks.length > 0 && (
          <>
            <button
              onClick={() => {
                endInterval();
              }}
              className="text-xs p-7 text-slate-400 hover:text-red-500 transition-colors text-center"
            >
              End Interval
            </button>
            <button
              onClick={() => {
                jumpToFirst();
              }}
              className="text-xs text-slate-400 hover:text-green-500 transition-colors text-center"
            >
              Jump To First
            </button>
          </>
        )}
      </div>
    </div>
  );
};

interface Timestamp {
  id: number;
  time: number;
}
