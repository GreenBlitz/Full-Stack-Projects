//בס"ד
import { useEffect, type FC } from "react";
import type { Alliance, TBAMatches2026 } from "@repo/scouting_types";
import type { TabProps } from "../ScoutMatch";

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
  CLOSE: "close",
  MIDDLE: "middle",
  FAR: "far",
} as const;

type initialLocationType =
  (typeof initialLocation)[keyof typeof initialLocation];

interface MatchQualWithTeamNumberProps {
  qual: number;
  alliance: Alliance;
  initialLocation: initialLocationType;
}

type Match = { blueAlliance: number[]; redAlliance: number[] };

const toTeamNum = (k: string) => Number(k.replace("frc", ""));

const toQualMatches = (matches: TBAMatches2026): Match[] =>
  matches
    .filter((m) => m.comp_level === "qm")
    .sort((a, b) => a.match_number - b.match_number)
    .map((m) => ({
      blueAlliance: m.alliances.blue.team_keys.map(toTeamNum),
      redAlliance: m.alliances.red.team_keys.map(toTeamNum),
    }));

const matchQualWithTeamNumber = (
  props: MatchQualWithTeamNumberProps,
  allMatches: Match[],
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
              setForm((prev) => ({
                ...prev,
                match: {
                  ...prev.match,
                  number: Number(event.target.value),
                },
              }));
            }}
          />
        </div>
      </div>
      <div className="w-120 border-2 border-green-500 rounded-lg p-5 flex flex-col gap-3 py-0 h-15">
        <div className="flex w-115 justify-between items-center text-green-500 pr-1 h-70">
          <div>Team Number:</div>
          <input
            type="number"
            className="inputStyle w-85 h-full"
            min={0}
            max={TEAM_NUMBER_MAX}
            value={form.teamNumber}
            onChange={(event) => {
              setForm((prev) => ({
                ...prev,
                teamNumber: Number(event.target.value),
              }));
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
              setForm((prev) => ({
                ...prev,
                match: {
                  ...prev.match,
                  type: event.target.value as
                    | "practice"
                    | "qualification"
                    | "playoff",
                },
              }));
            }}
          >
            <option value="practice">Practice</option>
            <option value="qualification">Qualification</option>
            <option value="playoff">Playoff</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export { PreMatchTab };
