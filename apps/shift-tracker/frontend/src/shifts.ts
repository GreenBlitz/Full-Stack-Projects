import { NetworkTables, NetworkTablesTypeInfos } from "ntcore-ts-client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const MILLISECONDS_IN_SECOND = 1000;

const TEAM_NUMBER = 4590;
const TIME_PATH = "FMSInfo/MatchTime";
const AUTO_WIN_PATH = "AdvantageKit/Tuning/Tunable/isOurHubActive";

const IS_AUTO_PATH = "AdvantageKit/DriverStation/Autonomous";

interface ShiftStats {
  isAuto: boolean | null;
  timeLeft: number | null;
  isWinner: boolean | null;
  start: () => void;
  restart: () => void;
}

export const useNTShiftStats = (): ShiftStats => {
  const [isAuto, setIsAuto] = useState<boolean | null>(null);

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isWinner, setIsWinner] = useState<boolean | null>(null);

  const start = useCallback(() => {
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

    auto.subscribe(setIsAuto);
    currentTime.subscribe(setTimeLeft);
    isAutoWinner.subscribe(setIsWinner);
  }, []);

  return { start, restart: () => {}, isAuto, timeLeft, isWinner };
};

const AUTO_START_TIME = 20;
const TELE_START_TIME = 140;

const TIMER_UPDATE_INTERVAL_MS = 100;

export const useManualShiftStats = (
  breakTime: number,
  isWinner: boolean = true,
): ShiftStats => {
  const [isAuto, setIsAuto] = useState<boolean>(true);

  const [timeLeft, setTimeLeft] = useState<number>(AUTO_START_TIME);

  const intervalID = useRef<number>(null);
  const timeoutID = useRef<number>(null);

  const startPeriod = useCallback(
    (periodTime: number, onEnd?: () => void) => {
      const startTime = Date.now();
      intervalID.current = setInterval(() => {
        const timeDifference =
          (Date.now() - startTime) / MILLISECONDS_IN_SECOND;
        setTimeLeft(periodTime - timeDifference);
      }, TIMER_UPDATE_INTERVAL_MS);
      timeoutID.current = setTimeout(() => {
        if (!intervalID.current) {
          return;
        }

        clearInterval(intervalID.current);
        setIsAuto(false);
        onEnd?.();
      }, periodTime * MILLISECONDS_IN_SECOND);
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
    clearTimeout(timeoutID.current ?? undefined);
    setTimeLeft(AUTO_START_TIME);
    setIsAuto(true);
  }, []);

  return { start, restart, timeLeft, isAuto, isWinner };
};

const COLOR_SHIFT = "bg-green-500";
const COLOR_NO_SHIFT = "bg-gray-800";
const COLOR_BLINK = "bg-orange-300";
const COLOR_BREAK = "bg-orange-700";

const BLACKOUT_SECONDS = [1, 2, 3, 106, 107, 108, 81, 82, 83, 56, 57, 58];
const BLACKOUT_WINNER_SECONDS = [131, 132, 133];
const BLACKOUT_LOSER_SECONDS = [31, 32, 33];

export const useTranslateToTimeAndColor = (
  timeLeft: number | null,
  isAuto: boolean | null,
  breakTime: number,
  isWinner: boolean = true,
) => {
  const [waitingTimer, setWaitingTimer] = useState(0);

  useEffect(() => {
    if (isAuto) {
      setWaitingTimer(0);
      return;
    }

    const startingTime = Date.now();

    const intervalId = setInterval(() => {
      const timeDifference =
        (Date.now() - startingTime) / MILLISECONDS_IN_SECOND;

      setWaitingTimer(breakTime - timeDifference);
    });
    setTimeout(() => {
      clearInterval(intervalId);
    }, breakTime * MILLISECONDS_IN_SECOND);
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
    isWinner ? BLACKOUT_WINNER_SECONDS : BLACKOUT_LOSER_SECONDS,
  ).includes(Math.floor(time * 2) / 2);
  const isWaiting = waitingTimer > 0;

  const shownTime = isWaiting ? waitingTimer : time;

  const color = isBlinking
    ? COLOR_BLINK
    : isWaiting
      ? COLOR_BREAK
      : isShiftOurs
        ? COLOR_SHIFT
        : COLOR_NO_SHIFT;

  return { color, time: shownTime };
};
