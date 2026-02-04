import React from "react";
import type { BurstData } from "./Counter";

interface Burst {
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  data: BurstData;
  editData: (data: BurstData) => void;
}

const Burst: React.FC<Burst> = ({ videoRef, data, editData }) => {
  const [thrown, setThrown] = React.useState(data.thrown);
  const [scored, setScored] = React.useState(data.scored);
  const [throwsArray, setThrowsArray] = React.useState<number[]>([]);
  const [scoredArray, setScoredArray] = React.useState<number[]>([]);

  return (
    <div
      style={{
        backgroundColor: "white",
        color: "black",
        padding: "10px",
        borderRadius: "10px",
        width: "250px",
        margin: "10px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: "10px",
        }}
      >
        <p>Thrown: {thrown}</p>
        <button
          id="thrownButton"
          style={{ height: "90px", width: "90px" }}
          onClick={() => {
            if (videoRef?.current) {
              setThrowsArray([
                ...throwsArray,
                Math.floor(videoRef.current.currentTime),
              ]);
            }
            setThrown(thrown + 1);
          }}
        >
          +1
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: "10px",
        }}
      >
        <p style={{ color: scored <= thrown ? "black" : "red" }}>
          Scored: {scored}
        </p>
        <button
          disabled={thrown <= scored ? true : false}
          style={{ height: "90px", width: "90px" }}
          onClick={() => {
            if (videoRef?.current) {
              setScoredArray([
                ...scoredArray,
                Math.floor(videoRef.current.currentTime),
              ]);
            }
            setScored(scored + 1);
          }}
        >
          +1
        </button>
      </div>
      <button
        onClick={() => {
          editData({
            index: data.index,
            thrown: thrown,
            scored: scored,
            thrownArray: throwsArray,
            scoredArray: scoredArray,
          });
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default Burst;
