//בס"ד
import { useEffect, useState, type FC, type JSX } from "react";
import {
  compareMatches,
  isMatchesSame,
  tbaMatchToRegularMatch,
  type Alliance,
  type Match,
  type TBAMatches2026,
  type TBAMatchesProps,
} from "@repo/scouting_types";
import type { TabProps } from "../ScoutMatch";
import { useLocalStorage } from "@repo/local_storage_hook";

const MATCH_NUMBER_MAX = 127;

export const fetchGameMatches = async <TBAMatches = unknown,>(
  event: string,
  maxMatch: Match,
): Promise<TBAMatches> => {
  const response = await fetch("/api/v1/tba/matches", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, maxMatch } satisfies TBAMatchesProps),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Server Error (${response.status}): ${text}`);
  }

  const { matches } = JSON.parse(text);
  return matches;
};

const initialLocation = ["close", "middle", "far"] as const;
type InitialLocation = (typeof initialLocation)[number];

interface RobotPositionInfo {
  alliance: Alliance;
  location: InitialLocation;
}

interface MatchQualWithTeamNumberProps {
  match: Match;
  alliance: Alliance;
  initialLocation: InitialLocation;
}

type MatchTeams = {
  blueAlliance: number[];
  redAlliance: number[];
  match: Match;
};

const toTeamNum = (k: string) => Number(k.replace("frc", ""));

const toQualMatches = (matches: TBAMatches2026): MatchTeams[] =>
  matches
    .map((tbaMatch) => ({
      match: tbaMatchToRegularMatch(tbaMatch),
      blueAlliance: tbaMatch.alliances.blue.team_keys.map(toTeamNum),
      redAlliance: tbaMatch.alliances.red.team_keys.map(toTeamNum),
    }))
    .sort((tbaMatch1, tbaMatch2) =>
      compareMatches(tbaMatch1.match, tbaMatch2.match),
    );

const matchMatchWithTeamNumber = (
  props: MatchQualWithTeamNumberProps,
  allTBAMatches: MatchTeams[],
): number => {
  const DEFAULT_TEAM_NUMBER = 0;

  const tbaMatch = allTBAMatches.find((tbaMatch) =>
    isMatchesSame(tbaMatch.match, props.match),
  );
  if (!tbaMatch) return DEFAULT_TEAM_NUMBER;

  const allianceArr =
    props.alliance === "blue" ? tbaMatch.blueAlliance : tbaMatch.redAlliance;

  const index =
    props.initialLocation === "close"
      ? 0
      : props.initialLocation === "middle"
        ? 1
        : 2;

  return allianceArr[index] ?? DEFAULT_TEAM_NUMBER;
};

const BASE_GAME: TBAMatches2026[number] = {
  actual_time: 1773016179,
  alliances: {
    blue: {
      dq_team_keys: [],
      score: 274,
      surrogate_team_keys: [],
      team_keys: ["frc971", "frc604", "frc7413"],
    },
    red: {
      dq_team_keys: [],
      score: 454,
      surrogate_team_keys: [],
      team_keys: ["frc5760", "frc1678", "frc9470"],
    },
  },
  comp_level: "qm",
  event_key: "2026cahal",
  key: "2026cahal_f1m1",
  match_number: 1,
  post_result_time: 1773016377,
  predicted_time: 1773015850,
  score_breakdown: {
    blue: {
      adjustPoints: 0,
      autoTowerPoints: 0,
      autoTowerRobot1: "None",
      autoTowerRobot2: "None",
      autoTowerRobot3: "None",
      endGameTowerPoints: 0,
      endGameTowerRobot1: "None",
      endGameTowerRobot2: "None",
      endGameTowerRobot3: "None",
      energizedAchieved: false,
      foulPoints: 35,
      hubScore: {
        uncounted: 0,
      },
      majorFoulCount: 2,
      minorFoulCount: 4,
      penalties: "None",
      rp: 0,
      superchargedAchieved: false,
      totalAutoPoints: 44,
      totalPoints: 274,
      totalTeleopPoints: 195,
      totalTowerPoints: 0,
      traversalAchieved: false,
    },
    red: {
      adjustPoints: 0,
      autoTowerPoints: 0,
      autoTowerRobot1: "None",
      autoTowerRobot2: "None",
      autoTowerRobot3: "None",
      endGameTowerPoints: 0,
      endGameTowerRobot1: "None",
      endGameTowerRobot2: "None",
      endGameTowerRobot3: "None",
      energizedAchieved: false,
      foulPoints: 50,
      hubScore: {
        uncounted: 37,
      },
      majorFoulCount: 0,
      minorFoulCount: 7,
      penalties: "None",
      rp: 0,
      superchargedAchieved: false,
      totalAutoPoints: 107,
      totalPoints: 454,
      totalTeleopPoints: 297,
      totalTowerPoints: 0,
      traversalAchieved: false,
    },
  },
  set_number: 1,
  time: 1773012240,
  videos: [
    {
      key: "ZN1shh2QF9k",
      type: "youtube",
    },
  ],
  winning_alliance: "red",
};

const makeGame = (
  teams: {
    red: [number, number, number];
    blue: [number, number, number];
  },
  qual: number,
) => ({
  ...BASE_GAME,
  match_number: qual,
  alliances: {
    blue: {
      dq_team_keys: [],
      score: 274,
      surrogate_team_keys: [],
      team_keys: [
        `frc${teams.blue[0]}`,
        `frc${teams.blue[1]}`,
        `frc${teams.blue[2]}`,
      ],
    },
    red: {
      dq_team_keys: [],
      score: 454,
      surrogate_team_keys: [],
      team_keys: [
        `frc${teams.red[0]}`,
        `frc${teams.red[1]}`,
        `frc${teams.red[2]}`,
      ],
    },
  },
});
const TESTING_COMP_MATCHES: TBAMatches2026 = [
  makeGame({ blue: [5614, 7039, 2231], red: [5987, 2630, 3075] }, 1),
  makeGame({ blue: [5951, 4590, 1690], red: [1577, 4744, 10935] }, 2),
  makeGame({ blue: [2231, 1690, 1577], red: [5614, 3075, 5951] }, 3),
  makeGame({ blue: [2630, 4590, 4744], red: [10935, 5987, 7039] }, 4),
  makeGame({ blue: [4744, 2231, 4590], red: [7039, 5951, 5614] }, 5),
  makeGame({ blue: [1577, 2630, 5987], red: [10935, 1690, 3075] }, 6),
  makeGame({ blue: [4590, 10935, 5614], red: [1690, 3075, 7039] }, 7),
  makeGame({ blue: [4744, 5987, 2231], red: [2630, 1577, 5951] }, 8),
  makeGame({ blue: [5951, 5987, 4590], red: [3075, 7039, 1577] }, 9),
  makeGame({ blue: [4744, 1690, 5614], red: [2231, 10935, 2630] }, 10),
  makeGame({ blue: [1690, 2231, 5987], red: [4590, 3075, 4744] }, 11),
  makeGame({ blue: [10935, 5951, 1577], red: [7039, 5614, 2630] }, 12),
  makeGame({ blue: [5951, 10935, 4744], red: [5987, 5614, 3075] }, 13),
  makeGame({ blue: [1690, 2231, 2630], red: [7039, 1577, 4590] }, 14),
  makeGame({ blue: [5987, 4744, 7039], red: [5614, 1577, 1690] }, 15),
  makeGame({ blue: [2630, 4590, 10935], red: [3075, 5951, 2231] }, 16),
];

const MATCH_ADJUSTMENT_OFFSET = 1;
const PreMatchTab: FC<TabProps> = ({
  currentForm: form,
  setForm,
  setAlliance,
}) => {
  const [robotPositionInfo, setRobotPositionInfo] =
    useLocalStorage<RobotPositionInfo>("robotPositionInfo", {
      alliance: "red",
      location: "close",
    });
  const [tbaMatches, setTbaMatches] = useLocalStorage<TBAMatches2026>(
    "tbaMatches",
    TESTING_COMP_MATCHES,
  );
  const [match, setMatch] = useState(form.match);

  const updateTBAMatches = async () => {
    if (tbaMatches.some((tbaMatch) => tbaMatch.match_number === match.number)) {
      return;
    }
    const newTBAMatches = await fetchGameMatches<TBAMatches2026>(
      form.competition,
      match,
    );
    setTbaMatches(newTBAMatches);
  };
  const handleManual = () => {
    const input = window.prompt("Enter the team number:");

    if (input === null) return;

    const teamNumber = parseInt(input);

    setForm((prev) => ({ ...prev, teamNumber }));
  };

  useEffect(() => {
    setAlliance(robotPositionInfo.alliance);
  }, [robotPositionInfo]);

  useEffect(() => {
    const qualMatches = toQualMatches(tbaMatches);
    const newTeam = matchMatchWithTeamNumber(
      {
        match: match,
        alliance: robotPositionInfo.alliance,
        initialLocation: robotPositionInfo.location,
      },
      qualMatches,
    );

    setForm((prev) => ({ ...prev, teamNumber: newTeam, match }));
  }, [tbaMatches, match, robotPositionInfo]);

  useEffect(() => {
    void updateTBAMatches();
  }, [match]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-3  mx-auto">
      <InputBox name="Scouter Name">
        <input
          type="text"
          className="w-85 h-full"
          defaultValue={form.scouterName}
          onChange={(event) => {
            setForm((prev) => ({
              ...prev,
              scouterName: event.target.value,
            }));
          }}
        />
      </InputBox>
      <InputBox name="Match Number">
        <>
          <input
            type="number"
            className="w-43.75 h-full"
            min={0}
            max={MATCH_NUMBER_MAX}
            value={match.number}
            onChange={(event) => {
              setMatch((prev) => ({
                ...prev,
                number: Number(event.target.value),
              }));
            }}
          />
          <button
            className="w-20 h-full"
            onClick={() => {
              setMatch((prev) => ({
                ...prev,
                number: prev.number + MATCH_ADJUSTMENT_OFFSET,
              }));
            }}
          >
            +
          </button>
          <button
            className="w-20 h-full"
            onClick={() => {
              setMatch((prev) => ({
                ...prev,
                number: prev.number - MATCH_ADJUSTMENT_OFFSET,
              }));
            }}
          >
            -
          </button>
        </>
      </InputBox>

      <InputBox name="Match Type">
        <select
          className="w-90.75 h-full"
          value={match.type}
          onChange={(event) => {
            if (event.target.value === "manual") {
              handleManual();
              return;
            }
            setMatch((prev) => ({
              ...prev,
              type: event.target.value as Match["type"],
            }));
          }}
        >
          <option value="practice">Practice</option>
          <option value="qualification">Qualification</option>
          <option value="playoff">Playoff</option>
          <option value="manual">Manual</option>
        </select>
      </InputBox>
      <InputBox name="Alliance">
        <select
          className="w-90.75 h-full"
          defaultValue={robotPositionInfo.alliance}
          onChange={(event) => {
            setRobotPositionInfo((prev) => ({
              ...prev,
              alliance: event.currentTarget.value as Alliance,
            }));
          }}
        >
          <option value="red" className="text-red-400">
            Red
          </option>
          <option value="blue" className="text-blue-400">
            Blue
          </option>
        </select>
      </InputBox>
      <InputBox name="Location">
        <select
          className="w-90.75 h-full"
          defaultValue={robotPositionInfo.location}
          onChange={(event) => {
            setRobotPositionInfo((prev) => ({
              ...prev,
              location: event.currentTarget.value as InitialLocation,
            }));
          }}
        >
          <option value="close">Close</option>
          <option value="middle">Middle</option>
          <option value="far">Far</option>
        </select>
      </InputBox>
    </div>
  );
};

interface InputBoxProps {
  name: string;
  children: JSX.Element;
}

const InputBox: FC<InputBoxProps> = ({ name, children }) => (
  <div className="w-120 border-2 border-green-500 rounded-lg p-5 flex flex-col gap-3 py-0 h-12">
    <div className="flex w-115 justify-between items-center text-green-500 pr-1 h-70">
      <div>{`${name}:`}</div>
      {children}
    </div>
  </div>
);

export { PreMatchTab };
