//בס"ד
import type React from "react";
import { useEffect, useState } from "react";
import { fetchTeamNumbers } from "../fetches";

const FIRST_INDEX = 0;
const SECOND_INDEX = 1;
const INCREMENT = 1;

export const Tinder: React.FC = () => {
  const [teamOrder, setTeamOrder] = useState<number[]>([]);
  const [indexOne, setIndexOne] = useState<number>(FIRST_INDEX);
  const [indexTwo, setIndexTwo] = useState<number>(SECOND_INDEX);

  useEffect(() => {
    fetchTeamNumbers().then(setTeamOrder).catch(console.error);
  }, []);

  const handleChosen = (chosenIndex: number) => {
    if (chosenIndex === indexOne) {
      const newOrder = [...teamOrder];
      [newOrder[indexOne], newOrder[indexTwo]] = [
        newOrder[indexTwo],
        newOrder[indexOne],
      ];

      setTeamOrder(newOrder);
      setIndexOne(indexTwo);
      setIndexTwo((prev) => prev + INCREMENT);
    } else {
      setIndexOne(indexTwo + INCREMENT);
    }
  };
  return (
    <>
      <div>
        {[indexOne, indexTwo].map((teamIndex) => (
          <button
            key={teamOrder[teamIndex]}
            onClick={() => {
              handleChosen(teamIndex);
            }}
          >
            choose me
          </button>
        ))}
      </div>
    </>
  );
};
