// בס"ד
import { useMemo, type FC } from "react";
import { useShiftStats } from "./useNetworkTables";

const testStats = { timeLeft: 105, isAuto: false, isWinner: null };

const secondsToTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0")}`;

const COLOR_SHIFT = "bg-green-500";
const COLOR_NO_SHIFT = "bg-gray-800";
const COLOR_BLINK = "bg-orange-300";

const BLACKOUT_SECONDS = [0, 2, 107, 109, 82, 84, 57, 59];
const BLACKOUT_WINNER_SECONDS = [132, 134];

const App: FC = () => {
  const { timeLeft, isAuto, isWinner } = testStats;

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

  const color = isBlinking
    ? COLOR_BLINK
    : isShiftOurs
      ? COLOR_SHIFT
      : COLOR_NO_SHIFT;

  return (
    <div className="w-screen h-screen">
      <div className={`flex w-full h-full  ${color}`}>
        <h1 className="w-min mx-auto my-5">{secondsToTime(time)}</h1>
      </div>
    </div>
  );
};

export default App;
