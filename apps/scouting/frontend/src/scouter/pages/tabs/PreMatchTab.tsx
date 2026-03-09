//בס"ד
import { useEffect, type FC } from "react";
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

const initialLocation = {
  close: "CLOSE",
  middle: "MIDDLE",
  far: "FAR",
} as const;

type InitialLocation = keyof typeof initialLocation;

interface RobotPositionInfo {
  alliance: Alliance;
  position: InitialLocation;
}

interface MatchQualWithTeamNumberProps {
  qual: number;
  alliance: Alliance;
  initialLocation: InitialLocation;
}

type MatchTeams = { blueAlliance: number[]; redAlliance: number[] };

const toTeamNum = (k: string) => Number(k.replace("frc", ""));

const toQualMatches = (matches: TBAMatches2026): MatchTeams[] =>
  matches
    .filter((match) => match.comp_level === "qm")
    .sort((match1, match2) => match1.match_number - match2.match_number)
    .map((match) => ({
      blueAlliance: match.alliances.blue.team_keys.map(toTeamNum),
      redAlliance: match.alliances.red.team_keys.map(toTeamNum),
    }));

const matchQualWithTeamNumber = (
  props: MatchQualWithTeamNumberProps,
  allMatches: MatchTeams[],
): number => {
  const DEFAULT_TEAM_NUMBER = 4590;
  const CALIBERATION_CONSTANT = 1;

  const match = allMatches[props.qual - CALIBERATION_CONSTANT];
  if (!match) return DEFAULT_TEAM_NUMBER;

  const allianceArr =
    props.alliance === "blue" ? match.blueAlliance : match.redAlliance;

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
      position: "close",
    });
  const [tbaMatches, setTbaMatches] = useLocalStorage<TBAMatches2026>(
    "tbaMatches",
    [],
  );

  const updateTBAMatches = async (newMatch: Match) => {
    const newTBAMatches = await fetchGameMatches<TBAMatches2026>(
      form.competition,
      newMatch.number,
    );
    setTbaMatches(newTBAMatches);
  };

  const updateMatch = (newItems: Partial<Match>) => {
    const newMatch = {
      ...form.match,
      ...newItems,
    };
    setForm((prev) => ({
      ...prev,
      match: newMatch,
    }));
    updateTBAMatches(newMatch);
  };

  useEffect(() => {
    const x = async () => {
      const tbaMatches = await fetchGameMatches<TBAMatches2026>(
        "2026cahal",
        20,
      );
      const allMatches = toQualMatches(tbaMatches);
      const team = matchQualWithTeamNumber(
        { qual: 23, alliance: "blue", initialLocation: "close" },
        allMatches,
      );
      console.log(allMatches);
      console.log(team);
    };
    x();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-3  mx-auto">
      <div className="w-120 border-2 border-green-500 rounded-lg p-5 flex flex-col gap-3 py-0 h-15">
        <div className="flex w-115 justify-between items-center text-green-500 pr-1 h-50">
          <div>Scouter Name:</div>
          <input
            type="text"
            className="inputStyle w-85 h-full"
            value={form.scouterName}
            onChange={(event) => {
              setForm((prev) => ({
                ...prev,
                scouterName: event.target.value,
              }));
            }}
          />
        </div>
      </div>
      <div className="w-120 border-2 border-green-500 rounded-lg p-5 flex flex-col gap-3 py-0 h-15">
        <div className="flex w-115 justify-between items-center text-green-500 pr-1 h-30">
          <div>Match Number:</div>
          <input
            type="number"
            className="inputStyle w-83.75 h-full"
            min={0}
            max={MATCH_NUMBER_MAX}
            value={form.match.number}
            onChange={(event) => {
              updateMatch({ number: Number(event.target.value) });
            }}
          />
        </div>
      </div>

      <div className="w-120 border-2 border-green-500 rounded-lg p-5 flex flex-col gap-3 py-0 h-15">
        <div className="flex w-115 justify-between items-center text-green-500 pr-1 h-70">
          <div>Match Type:</div>
          <select
            className="inputStyle w-90.75 h-full"
            value={form.match.type}
            onChange={(event) => {
              updateMatch({
                type: event.target.value as Match["type"],
              });
            }}
          >
            <option value="practice">Practice</option>
            <option value="qualification">Qualification</option>
            <option value="playoff">Playoff</option>
          </select>
        </div>
      </div>
      <div className="w-120 border-2 border-green-500 rounded-lg p-5 flex flex-col gap-3 py-0 h-15">
        <div className="flex w-115 justify-between items-center text-green-500 pr-1 h-70">
          <div>Alliance</div>
          <select
            className="inputStyle w-90.75 h-full"
            value={form.match.type}
            onChange={(event) => {
              setRobotPositionInfo((prev) => ({
                ...prev,
                alliance: event.currentTarget.value as Alliance,
              }));
            }}
          >
            <option value="red">Practice</option>
            <option value="blue">Qualification</option>
          </select>
        </div>
      </div>
      <div className="w-120 border-2 border-green-500 rounded-lg p-5 flex flex-col gap-3 py-0 h-15">
        <div className="flex w-115 justify-between items-center text-green-500 pr-1 h-70">
          <div>Location</div>
          <select
            className="inputStyle w-90.75 h-full"
            value={form.match.type}
            onChange={(event) => {
              setRobotPositionInfo((prev) => ({
                ...prev,
                position: event.currentTarget.value as InitialLocation,
              }));
            }}
          >
            <option value="close">Close</option>
            <option value="middle">Middle</option>
            <option value="far">Far</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export { PreMatchTab };
