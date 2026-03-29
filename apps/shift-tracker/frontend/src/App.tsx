// בס"ד
import { useEffect, useMemo, useState, type FC } from "react";
import { useShiftStats } from "./useNetworkTables";

const testStats = { timeLeft: 140, isAuto: false, isWinner: null };

const secondsToTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0")}`;

const COLOR_SHIFT = "bg-green-500";
const COLOR_NO_SHIFT = "bg-gray-800";
const COLOR_BLINK = "bg-orange-300";

const BLACKOUT_SECONDS = [0, 2, 107, 109, 82, 84, 57, 59];
const BLACKOUT_WINNER_SECONDS = [132, 134];

const AUTO_WAIT_TIME = 7;

const App: FC = () => {
  const { timeLeft, isAuto, isWinner } = testStats;

  const [waitingTimer, setWaitingTimer] = useState(0);

  useEffect(() => {
    if (isAuto) {
      return;
    }

    const startingTime = Date.now();

    const intervalId = setInterval(() => {
      const timeDifference = (Date.now() - startingTime) / 1000;

      setWaitingTimer(AUTO_WAIT_TIME - timeDifference);
    });
    setTimeout(() => {
      clearInterval(intervalId);
    }, AUTO_WAIT_TIME * 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [isAuto]);

  console.log(waitingTimer);

  const time = useMemo(() => timeLeft ?? 0, [timeLeft]);

  const isShiftOurs = useMemo(() => {
    if (isAuto ?? true) {
      return true;
    }

    //transition
    if (time > 130) {
      return true;
    }

    //endgame
    if (time < 30) {
      return true;
    }

    //shift1
    if (time > 105) {
      return !isWinner;
    }

    //shift2
    if (time > 80) {
      return Boolean(isWinner);
    }

    //shift3
    if (time > 55) {
      return !isWinner;
    }

    //shift 4
    return Boolean(isWinner);
  }, [time, isAuto, isWinner]);

  console.log(isShiftOurs);
  const isBlinking = BLACKOUT_SECONDS.concat(
    isWinner ? BLACKOUT_WINNER_SECONDS : [],
  ).includes(Math.floor(time));
  const isWaiting = waitingTimer > 0;

  const color =
    isBlinking || isWaiting
      ? COLOR_BLINK
      : isShiftOurs
        ? COLOR_SHIFT
        : COLOR_NO_SHIFT;

  return (
    <div className="w-screen h-screen">
      <div className={`flex w-full h-full  ${color}`}>
        <h1 className="w-min mx-auto my-5">
          {secondsToTime(isWaiting ? waitingTimer : time)}
        </h1>
      </div>
    </div>
  );
};

export default App;
