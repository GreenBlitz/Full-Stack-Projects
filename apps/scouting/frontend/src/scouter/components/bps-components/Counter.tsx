//בס"ד
import React from "react";
import Burst from "./Burst";
import "./Video.css";
import "./Counter.css";
import "./BpsBase.css";

interface CounterProps {
  videoRef?: React.RefObject<HTMLVideoElement | null>;
}

export interface BurstData {
  index: number;
  thrown: number;
  scored: number;
  thrownArray: number[];
  scoredArray: number[];
}

const Counter: React.FC<CounterProps> = ({ videoRef }) => {
  const zero = 0;
  const one = 1;

  const [burstsArray, setBurstsArray] = React.useState<BurstData[]>([
    {
      index: 0,
      thrown: 0,
      scored: 0,
      thrownArray: [],
      scoredArray: [],
    },
  ]);

  const [currentBurstIndex, setCurrentBurstIndex] =
    React.useState<number>(zero);

  const updateCurrentBurst = (updatedBurst: BurstData) => {
    const copy = [...burstsArray];
    copy[currentBurstIndex] = updatedBurst;
    setBurstsArray(copy);
  };

  const addNewBurst = () => {
    const newBurst: BurstData = {
      index: burstsArray.length,
      thrown: 0,
      scored: 0,
      thrownArray: [],
      scoredArray: [],
    };

    setBurstsArray([...burstsArray, newBurst]);
    setCurrentBurstIndex(burstsArray.length);
  };

  const goBack = () => {
    if (currentBurstIndex > zero) {
      setCurrentBurstIndex(currentBurstIndex - one);
    }
  };

  const goForward = () => {
    if (currentBurstIndex < burstsArray.length - one) {
      setCurrentBurstIndex(currentBurstIndex + one);
    }
  };

  return (
    <>
      <div id="counterDiv">
        <Burst
          videoRef={videoRef}
          data={burstsArray[currentBurstIndex]}
          onChange={updateCurrentBurst}
        />
        <div>
          <button className="leftButton settingsButton" onClick={goBack}>
            {"<<<"}
          </button>
          <button className="centerButton settingsButton" onClick={addNewBurst}>
            +
          </button>
          <button className="rightButton settingsButton" onClick={goForward}>
            {">>>"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Counter;
