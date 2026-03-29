// בס"ד
import { useEffect, useMemo, useState, type FC } from "react";
import { useShiftStats } from "./useNetworkTables";

const testStats = { timeLeft: 3, isAuto: true, isWinner: null };

const secondsToTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0")}`;

const COLOR_SHIFT = "bg-green-500";
const COLOR_NO_SHIFT = "bg-gray-800";

const BLACKOUT_SECONDS = [0, 2, 132, 134, 107, 109, 82, 84, 57, 59];

const App: FC = () => {
  const { timeLeft, isAuto, isWinner } = useShiftStats();

  const isShiftOurs = useMemo(() => {
    if (isAuto ?? true) {
      return true;
    }

    //transition
    if (timeLeft > 130) {
      return true;
    }

    //endgame
    if (timeLeft < 30) {
      return true;
    }

    //shift1
    if (timeLeft > 105) {
      return !isWinner;
    }

    //shift2
    if (timeLeft > 80) {
      return isWinner;
    }

    //shift3
    if (timeLeft > 55) {
      return !isWinner;
    }

    //shift 4
    return isWinner;
  }, [timeLeft, isAuto, isWinner]);

  const isBlinking = BLACKOUT_SECONDS.includes(Math.floor(timeLeft));
  const showColor = isShiftOurs ? !isBlinking : isBlinking;

  return (
    <div className="w-screen h-screen">
      <div
        className={`flex w-full h-full  ${showColor ? COLOR_SHIFT : COLOR_NO_SHIFT}`}
      >
        <h1 className="w-min mx-auto my-5">{secondsToTime(timeLeft)}</h1>
      </div>
    </div>
  );
};

export default App;
