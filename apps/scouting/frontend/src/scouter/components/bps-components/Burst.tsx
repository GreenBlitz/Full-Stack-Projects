//בס"ד
import type React from "react";
import type { BurstData } from "./Counter";
import type { VideoPlayerHandle } from "./Video";

interface BurstProps {
  playerRef?: React.RefObject<VideoPlayerHandle | null>;
  data: BurstData;
  onChange: (data: BurstData) => void;
}

const incrementCounter = (playerRef: React.RefObject<VideoPlayerHandle | null> | undefined, data: BurstData, onChange: (data: BurstData) => void) => {
  const COUNTER_INCREMENT = 1;
  if (!playerRef?.current) return;

  const currentTime = playerRef.current.currentTime;

  onChange({
    ...data,
    thrown: data.thrown + COUNTER_INCREMENT,
    thrownArray: [...data.thrownArray, currentTime],
  });
};

const handleScored = (playerRef: React.RefObject<VideoPlayerHandle | null> | undefined, data: BurstData, onChange: (data: BurstData) => void) => {
  const COUNTER_INCREMENT = 1;
  if (!playerRef?.current) return;

  const currentTime = playerRef.current.currentTime;

  onChange({
    ...data,
    scored: data.scored + COUNTER_INCREMENT,
    scoredArray: [...data.scoredArray, currentTime],
  });
};

const Burst: React.FC<BurstProps> = ({ playerRef, data, onChange }) => {
  const btnClass =
    "w-[90px] h-[90px] bg-slate-800 text-white rounded-xl border border-white/10 font-bold m-2.5 hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-800";

  return (
    <div className="bg-slate-900/40 text-slate-200 rounded-2xl border border-white/10 p-2 inline-flex justify-center">
      <div className="flex flex-col items-center m-2.5">
        <p className="text-sm font-bold text-slate-400 mb-1">Thrown</p>
        <p className="text-2xl font-black tabular-nums">{data.thrown}</p>
        <button
          className={btnClass}
          onClick={() => incrementCounter(playerRef, data, onChange)}
        >
          +1
        </button>
      </div>
      <div className="flex flex-col items-center m-2.5">
        <p className="text-sm font-bold text-slate-400 mb-1">Scored</p>
        <p className="text-2xl font-black tabular-nums">{data.scored}</p>
        <button
          className={btnClass}
          disabled={data.thrown <= data.scored}
          onClick={() => handleScored(playerRef, data, onChange)}
        >
          +1
        </button>
      </div>
    </div>
  );
};

export default Burst;
