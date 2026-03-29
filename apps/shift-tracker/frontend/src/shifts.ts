import { NetworkTables, NetworkTablesTypeInfos } from "ntcore-ts-client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const TEAM_NUMBER = 4590;
const TIME_PATH = "FMSInfo/MatchTime";
const AUTO_WIN_PATH = "AdvantageKit/Tuning/Tunable/isOurHubActive";

const IS_AUTO_PATH = "AdvantageKit/DriverStation/Autonomous";

export const useNTShiftStats = () => {
  const ntcore = NetworkTables.getInstanceByTeam(TEAM_NUMBER);

  const currentTime = ntcore.createTopic<number>(
    TIME_PATH,
    NetworkTablesTypeInfos.kDouble,
  );
  const isAutoWinner = ntcore.createTopic<boolean>(
    AUTO_WIN_PATH,
    NetworkTablesTypeInfos.kBoolean,
  );
  const auto = ntcore.createTopic<boolean>(
    IS_AUTO_PATH,
    NetworkTablesTypeInfos.kBoolean,
  );

  const [isAuto, setIsAuto] = useState<boolean | null>(null);

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isWinner, setIsWinner] = useState<boolean | null>(null);

  auto.subscribe(setIsAuto);
  currentTime.subscribe(setTimeLeft);
  isAutoWinner.subscribe(setIsWinner);

  return { isAuto, timeLeft, isWinner };
};

const COLOR_SHIFT = "bg-green-500";
const COLOR_NO_SHIFT = "bg-gray-800";
const COLOR_BLINK = "bg-orange-300";

const BLACKOUT_SECONDS = [0, 2, 107, 109, 82, 84, 57, 59];
const BLACKOUT_WINNER_SECONDS = [132, 134];

const AUTO_WAIT_TIME = 7;

export const useTranslateToTimeAndColor = (
  timeLeft: number,
  isAuto: boolean,
  isWinner: boolean = true,
) => {
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

  const isBlinking = BLACKOUT_SECONDS.concat(
    isWinner ? BLACKOUT_WINNER_SECONDS : [],
  ).includes(Math.floor(time));
  const isWaiting = waitingTimer > 0;

  const shownTime = isWaiting ? waitingTimer : time;

  const color =
    isBlinking || isWaiting
      ? COLOR_BLINK
      : isShiftOurs
        ? COLOR_SHIFT
        : COLOR_NO_SHIFT;

  return { color, time: shownTime };
};

const AUTO_START_TIME = 20;
const TELE_START_TIME = 140;

const TIMER_UPDATE_INTERVAL_MS = 100;

export const useManualShiftStats = (
  breakTime: number,
  isWinner: boolean = true,
) => {
  const [isAuto, setIsAuto] = useState<boolean>(true);

  const [timeLeft, setTimeLeft] = useState<number>(AUTO_START_TIME);

  const intervalID = useRef<number>(null);

  const startPeriod = useCallback(
    (periodTime: number, onEnd?: () => void) => {
      const startTime = Date.now();
      intervalID.current = setInterval(() => {
        const timeDifference = (Date.now() - startTime) / 1000;
        console.log("Updating for PeriodTime", periodTime);
        setTimeLeft(periodTime - timeDifference);
      }, 100);
      setTimeout(() => {
        if (!intervalID.current) {
          return;
        }
        console.log("cleared ID", intervalID.current);

        clearInterval(intervalID.current);
        setIsAuto(false);
        onEnd?.();
      }, periodTime * 1000);
    },
    [breakTime],
  );

  const start = useCallback(() => startPeriod(AUTO_START_TIME, startTele), []);

  const startTele = useCallback(
    () => startPeriod(TELE_START_TIME + breakTime),
    [],
  );

  const restart = useCallback(() => {
    clearInterval(intervalID.current ?? undefined);
    setTimeLeft(AUTO_START_TIME);
    setIsAuto(true);
  }, []);

  return { start, restart, timeLeft, isAuto, isWinner };
};
