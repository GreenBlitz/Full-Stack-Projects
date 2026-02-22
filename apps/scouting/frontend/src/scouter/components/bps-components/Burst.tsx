//בס"ד
import type React from "react";
import type { BurstData } from "./Counter";

interface BurstProps {
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  data: BurstData;
  onChange: (data: BurstData) => void;
}




const incrementCounter = (videoRef: React.RefObject<HTMLVideoElement | null> | undefined, data: BurstData, onChange: (data: BurstData) => void) => {
  const COUNTER_INCREMENT = 1;
  if (!videoRef?.current) return;
  if (videoRef.current === undefined) return;

  const currentTime = videoRef.current.currentTime;

  onChange({
    ...data,
    thrown: data.thrown + COUNTER_INCREMENT,
    thrownArray: [...data.thrownArray, currentTime],
  });
};

const handleScored = (videoRef: React.RefObject<HTMLVideoElement | null> | undefined, data: BurstData, onChange: (data: BurstData) => void) => {
  const COUNTER_INCREMENT = 1;
  if (!videoRef?.current) return;
  if (videoRef.current === undefined) return;

  const currentTime = videoRef.current.currentTime;

  onChange({
    ...data,
    scored: data.scored + COUNTER_INCREMENT,
    scoredArray: [...data.scoredArray, currentTime],
  });
};

const Burst: React.FC<BurstProps> = ({ videoRef, data, onChange }) => {
  const COUNTER_INCREMENT = 1;
  return (
    <div
      className="
        bg-white
        text-black
        rounded-[10px]
        w-62.5
        m-2.5
        inline-flex
        justify-center
        border-2
        border-black
      "
    >
      {/* THROWN */}
      <div
        className="
          flex
          flex-col
          items-center
          m-2.5
        "
      >
        <p>Thrown: {data.thrown}</p>
        <button
          className="
            w-22.5
            h-22.5
            bg-[#1a1a1a]
            text-white
            m-1.25
          "
          onClick={() => incrementCounter (videoRef, data, onChange)}
        >
          +1
        </button>
      </div>

      {/* SCORED */}
      <div
        className="
          flex
          flex-col
          items-center
          m-2.5
        "
      >
        <p>Scored: {data.scored}</p>
        <button
          className="
            w-22.5
            h-22.5
            bg-[#1a1a1a]
            text-white
            m-1.25
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
          disabled={data.thrown <= data.scored}
          onClick={() => handleScored(videoRef, data, onChange)}
        >
          +1
        </button>
      </div>
    </div>
  );
};

export default Burst;
