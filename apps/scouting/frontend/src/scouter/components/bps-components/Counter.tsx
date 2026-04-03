//בס"ד
import React from "react";
import Burst from "./Burst";
import type { VideoPlayerHandle } from "@repo/video-utils";
import type { BPS } from "@repo/scouting_types";

interface CounterProps {
  playerRef?: React.RefObject<VideoPlayerHandle | null>;
}

export interface BurstData {
  index: number;
  thrown: number;
  scored: number;
  thrownArray: number[];
  scoredArray: number[];
}

const Counter: React.FC<CounterProps> = ({ playerRef }) => {
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

  const [team, setTeam] = React.useState<number>(0);
  const [match, setMatch] = React.useState<number>(0);

  const [currentBurstIndex, setCurrentBurstIndex] = React.useState<number>(
    COUNTER_STARTING_VALUE,
  );

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
          playerRef={playerRef}
          data={burstsArray[currentBurstIndex]}
          onChange={updateCurrentBurst}
        />
        <div className="flex gap-1 justify-center mt-2">
          <button
            className="w-10 h-10 bg-slate-800 text-white rounded-l-xl border border-white/5 font-medium hover:bg-slate-700 transition-colors"
            onClick={goBack}
          >
            {"<<<"}
          </button>
          <button
            className="w-10 h-10 bg-slate-800 text-white rounded-none border border-white/5 font-medium hover:bg-slate-700 transition-colors"
            onClick={addNewBurst}
          >
            +
          </button>
          <button
            className="w-10 h-10 bg-slate-800 text-white rounded-r-xl border border-white/5 font-medium hover:bg-slate-700 transition-colors"
            onClick={goForward}
          >
            {">>>"}
          </button>
          <input
            type="number"
            onChange={(event) => {
              setTeam(Number(event.currentTarget.value));
            }}
            placeholder="Enter Team"
          ></input>
          <input
            type="number"
            onChange={(event) => {
              setMatch(Number(event.currentTarget.value));
            }}
            placeholder="Enter Match"
          ></input>
          <button
            onClick={async () => {
              const bps: BPS = {
                team,
                match: {
                  type: "qualification",
                  number: match,
                },
                events: burstsArray.map((burst) => ({
                  shoot: burst.thrownArray,
                  score: burst.scoredArray,
                  positions: [],
                })),
              };
              try {
                const response = await fetch("/api/v1/bps", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(bps),
                });
                alert(await response.json());
              } catch (error: unknown) {
                alert(error);
              }
            }}
            className="bg-green-800 p-4"
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default Counter;
