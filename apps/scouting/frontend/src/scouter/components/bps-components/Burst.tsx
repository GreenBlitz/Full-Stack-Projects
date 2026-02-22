//בס"ד
import type React from "react";
import type { BurstData } from "./Counter";
import "./Burst.css";
import "./BpsBase.css";

interface BurstProps {
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  data: BurstData;
  onChange: (data: BurstData) => void;
}

const Burst: React.FC<BurstProps> = ({ videoRef, data, onChange }) => {
  const one = 1;

  const handleThrown = () => {
    if (!videoRef?.current) return;

    const currentTime = Math.floor(videoRef.current.currentTime);

    onChange({
      ...data,
      thrown: data.thrown + one,
      thrownArray: [...data.thrownArray, currentTime],
    });
  };

  const handleScored = () => {
    if (!videoRef?.current) return;

    const currentTime = Math.floor(videoRef.current.currentTime);

    onChange({
      ...data,
      scored: data.scored + one,
      scoredArray: [...data.scoredArray, currentTime],
    });
  };

  return (
    <>
      <div className="burstDiv">
        {/* THROWN */}
        <div className="burstColumn">
          <p>Thrown: {data.thrown}</p>
          <button
            className="burstButton"
            onClick={handleThrown}
          >
            +1
          </button>
        </div>

        {/* SCORED */}
        <div className="burstColumn">
          <p>Scored: {data.scored}</p>
          <button
            className="burstButton"
            disabled={data.thrown <= data.scored}
            onClick={handleScored}
          >
            +1
          </button>
        </div>
      </div>
    </>
  );
};

export default Burst;
