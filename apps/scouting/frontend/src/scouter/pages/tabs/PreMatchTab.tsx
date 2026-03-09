//בס"ד
import { useEffect, useState, type FC, type JSX } from "react";
import type { Alliance, Match, TBAMatches2026 } from "@repo/scouting_types";
import type { TabProps } from "../ScoutMatch";
import { useLocalStorage } from "@repo/local_storage_hook";

const MATCH_NUMBER_MAX = 127;
const TEAM_NUMBER_MAX = 16383;

export const fetchGameMatches = async <TBAMatches = unknown,>(
  event: string,
  maxMatch: number,
): Promise<TBAMatches> => {
  const response = await fetch("/api/v1/tba/matches", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, maxMatch }),
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
  qual: number;
  alliance: Alliance;
  initialLocation: InitialLocation;
}

type MatchTeams = {
  blueAlliance: number[];
  redAlliance: number[];
  matchNumber: number;
};

const toTeamNum = (k: string) => Number(k.replace("frc", ""));

const toQualMatches = (matches: TBAMatches2026): MatchTeams[] =>
  matches
    .filter((tbaMatch) => tbaMatch.comp_level === "qm")
    .sort(
      (tbaMatch1, tbaMatch2) => tbaMatch1.match_number - tbaMatch2.match_number,
    )
    .map((tbaMatch) => ({
      matchNumber: tbaMatch.match_number,
      blueAlliance: tbaMatch.alliances.blue.team_keys.map(toTeamNum),
      redAlliance: tbaMatch.alliances.red.team_keys.map(toTeamNum),
    }));

const matchQualWithTeamNumber = (
  props: MatchQualWithTeamNumberProps,
  allTBAMatches: MatchTeams[],
): number => {
  const DEFAULT_TEAM_NUMBER = 0;

  const tbaMatch = allTBAMatches.find(
    (tbaMatch) => tbaMatch.matchNumber === props.qual,
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

const PreMatchTab: FC<TabProps> = ({ currentForm: form, setForm }) => {
  const [robotPositionInfo, setRobotPositionInfo] =
    useLocalStorage<RobotPositionInfo>("robotPositionInfo", {
      alliance: "red",
      location: "close",
    });
  const [tbaMatches, setTbaMatches] = useLocalStorage<TBAMatches2026>(
    "tbaMatches",
    [],
  );
  const [match, setMatch] = useState(form.match);

  const updateTBAMatches = async () => {
    if (tbaMatches.some((tbaMatch) => tbaMatch.match_number === match.number)) {
      return;
    }
    const newTBAMatches = await fetchGameMatches<TBAMatches2026>(
      form.competition,
      match.number,
    );
    setTbaMatches(newTBAMatches);
  };

  useEffect(() => {
    const qualMatches = toQualMatches(tbaMatches);
    const newTeam = matchQualWithTeamNumber(
      {
        qual: match.number,
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
      <InputBox name="Match Number">
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
        <input
          type="number"
          className="w-83.75 h-full"
          min={0}
          max={MATCH_NUMBER_MAX}
          defaultValue={match.number}
          onChange={(event) => {
            setMatch((prev) => ({
              ...prev,
              number: Number(event.target.value),
            }));
          }}
        />
      </InputBox>

      <InputBox name="Match Type">
        <select
          className="w-90.75 h-full"
          defaultValue={match.type}
          onChange={(event) => {
            setMatch((prev) => ({
              ...prev,
              type: event.target.value as Match["type"],
            }));
          }}
        >
          <option value="practice">Practice</option>
          <option value="qualification">Qualification</option>
          <option value="playoff">Playoff</option>
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
