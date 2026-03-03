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
  const [isSortComplete, setSortComlete] = useState<boolean>(true);

  useEffect(() => {
    fetchTeamNumbers().then(setTeamOrder).catch(console.error);
  }, []);

  const handleChosen = (winnerIndex: number) => {
    const nextTeamIndex = indexTwo + INCREMENT;
    if (winnerIndex === indexOne) {
      const newOrder = [...teamOrder];

      [newOrder[indexOne], newOrder[indexTwo]] = [
        newOrder[indexTwo],
        newOrder[indexOne],
      ];

      setTeamOrder(newOrder);
    }
    setIndexOne(indexTwo);
    setIndexTwo(nextTeamIndex);

    setSortComlete(nextTeamIndex >= teamOrder.length);
  };

  return (
    <>
      <div>
        <button
          onClick={() => {
            setSortComlete(false);
          }}
        >
          start sorting!
        </button>
        {!isSortComplete && (
          <div>
            <p>
              index one: {indexOne} index two: {indexTwo}
            </p>
            {[indexOne, indexTwo].map((teamIndex) => (
              <button
                key={teamOrder[teamIndex]}
                onClick={() => {
                  handleChosen(teamIndex);
                }}
              >
                ::::choose me {teamOrder[teamIndex]} index: {teamIndex}
              </button>
            ))}

            {teamOrder.map((teamNumber) => (
              <p key={teamNumber}>{teamNumber}</p>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
