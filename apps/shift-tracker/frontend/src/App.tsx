// בס"ד
import { useMemo, type FC } from "react";
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
      return isWinner;
    }

    //shift3
    if (time > 55) {
      return !isWinner;
    }

    //shift 4
    return isWinner;
  }, [time, isAuto, isWinner]);

  const isBlinking = BLACKOUT_SECONDS.includes(Math.floor(time));
  const showColor = isShiftOurs ? !isBlinking : isBlinking;

  return (
    <div className="w-screen h-screen">
      <div
        className={`flex w-full h-full  ${showColor ? COLOR_SHIFT : COLOR_NO_SHIFT}`}
      >
        <h1 className="w-min mx-auto my-5">{secondsToTime(time)}</h1>
      </div>
    </div>
  );
};

export default App;
