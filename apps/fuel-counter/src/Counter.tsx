import React from "react";
import Burst from "./Burst";

interface Counter {
  videoRef?: React.RefObject<HTMLVideoElement | null>
}

export interface BurstData {
  index: number
  thrown: number
  scored: number
  thrownArray: number[]
  scoredArray: number[]
}

const Counter: React.FC<Counter> = ({ videoRef }) => {
  const [burstsArray, setBurstsArray] = React.useState<BurstData[]>([]);
  const [currentBurstIndex, setCurrentBurstIndex] = React.useState(0);
  const [burstData, setBurstData] = React.useState<BurstData>(
    {index: 0, thrown: 0, scored: 0, thrownArray: [], scoredArray: []}
  );
  
  return (
    <>
      <div style={{width:"100vw", backgroundColor:"white"}}>
          <Burst 
            videoRef={videoRef}
            data={burstsArray[currentBurstIndex]}
            editData={setBurstData}
          />
      </div>
      <button onClick={() => {
        if (currentBurstIndex > 0) {
          setCurrentBurstIndex(currentBurstIndex - 1)
        }
      }}>
        {"<<<"}
      </button>
      <button onClick={() => {
        setBurstsArray([...burstsArray, {index: currentBurstIndex + 1, thrown: 0, scored: 0, thrownArray: [], scoredArray: []}]);
        setCurrentBurstIndex(currentBurstIndex + 1)
      }}>
        +
      </button>
      <button onClick={() => {
        if (currentBurstIndex > 0) {
          setCurrentBurstIndex(currentBurstIndex + 1)
        }
      }}>
        {">>>"}
      </button>
    </>
  )
}

export default Counter;