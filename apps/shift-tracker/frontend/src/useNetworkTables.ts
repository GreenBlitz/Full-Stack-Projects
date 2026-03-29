import { NetworkTables, NetworkTablesTypeInfos } from "ntcore-ts-client";
import { useState } from "react";

const TEAM_NUMBER = 4590;
const TIME_PATH = "FMSInfo/MatchTime";
const AUTO_WIN_PATH = "AdvantageKit/Tuning/Tunable/isOurHubActive";

const IS_AUTO_PATH = "AdvantageKit/DriverStation/Autonomous";

export const useShiftStats = () => {
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
