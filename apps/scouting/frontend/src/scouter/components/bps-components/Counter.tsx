//בס"ד
import React from "react";
import Burst from "./Burst";

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
  const COUNTER_STARTING_VALUE = 0;
  const increment = 1;

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
    React.useState<number>(COUNTER_STARTING_VALUE);

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
    if (currentBurstIndex > COUNTER_STARTING_VALUE) {
      setCurrentBurstIndex(currentBurstIndex - increment);
    }
  };

  const goForward = () => {
    if (currentBurstIndex < burstsArray.length - increment) {
      setCurrentBurstIndex(currentBurstIndex + increment);
    }
  };

  return (
    <>
      <div>
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
