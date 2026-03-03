//בס"ד
import type React from "react";
import { useEffect, useState } from "react";
import { fetchTeamNumbers } from "../fetches";
import type { TinderStats } from "@repo/scouting_types";

const FIRST_INDEX = 0;
const SECOND_INDEX = 1;
const INCREMENT = 1;

const tinderUrl = "/api/v1/tinder/";

const fetchTeamTinderStats = async (teamNumber: number) => {
  const params = new URLSearchParams({ teamNumber: teamNumber.toString() });
  const url = `${tinderUrl}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server Error: ${errorText}`);
    }

    const data = await response.json();
    return data.teamTinderStats as TinderStats;
  } catch (err) {
    console.error("Fetch failed:", err);
    throw err;
  }
};

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
        )}
      </div>
    </>
  );
};
