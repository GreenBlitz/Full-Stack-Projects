//בס"ד
import React, { type FC, type Dispatch, type SetStateAction } from "react";
import type { TabProps } from "./scouter/pages/ScoutMatch";
import type { Alliance } from "@repo/scouting_types";
const MATCH_NUMBER_MAX = 127;
const TEAM_NUMBER_MAX = 16383;

type FRC_ISDE_2025_EventKey =
  | "2025isde1"
  | "2025isde2"
  | "2025isde3"
  | "2025isde4"
  | "2025iscmp";

const compareUrl = "/api/v1/matches";

type MatchesResponse<TMatch = unknown> = {
  matches: TMatch[];
};

export const fetchGameMatches = async <TMatch = unknown>(
  event: FRC_ISDE_2025_EventKey,
  maxMatch: number,
): Promise<TMatch[]> => {
  const response = await fetch(compareUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, maxMatch }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server Error: ${errorText}`);
  }

  const data = (await response.json()) as MatchesResponse<TMatch>;
  return data.matches;
};


type initialLocation = "close" | "middle" | "far";

interface MatchQualWithTeamNumberProps {
  qual: number;
  alliance: Alliance;
  initialLocation: initialLocation;
}

const matchQualWithTeamNumber = (
  matchQualWithTeamNumberProps: MatchQualWithTeamNumberProps,
): number => {
  const DEFAULT_TEAM_NUMBER = 4590;
  const CALIBERATION_CONSTANT = 1;
  const CLOSE_INDEX = 0;
  const MIDDLE_INDEX = 1;
  const FAR_INDEX = 2;
  type Match = {
    blueAlliance: number[];
    redAlliance: number[];
  };

  const allMatches: Match[] = [
    {
      blueAlliance: [1690, 1577, 2230],
      redAlliance: [3339, 5951, 7067],
    },
    {
      blueAlliance: [4416, 5654, 5987],
      redAlliance: [1690, 1577, 2230],
    },
    {
      blueAlliance: [7067, 3339, 5951],
      redAlliance: [4416, 5654, 5987],
    },
  ];

    const allMatches1 = fetchGameMatches("2025isde1", 50)


  const index = matchQualWithTeamNumberProps.qual - CALIBERATION_CONSTANT;

  if (!allMatches[index]) {
    console.error("Match data is unavailable");
    return DEFAULT_TEAM_NUMBER;
  }

  const match = allMatches[index];

  const alliance: Alliance = matchQualWithTeamNumberProps.alliance;

  switch (matchQualWithTeamNumberProps.initialLocation) {
    case "close":
      return alliance === "blue"
        ? match.blueAlliance[CLOSE_INDEX]
        : match.redAlliance[CLOSE_INDEX];
    case "middle":
      return alliance === "blue"
        ? match.blueAlliance[MIDDLE_INDEX]
        : match.redAlliance[MIDDLE_INDEX];
    case "far":
      return alliance === "blue"
        ? match.blueAlliance[FAR_INDEX]
        : match.redAlliance[FAR_INDEX];
    default:
      return DEFAULT_TEAM_NUMBER;
  }
};

const PreMatchTab: FC<TabProps> = ({ currentForm: form, setForm }) => {
  const matchQualWithTeamNumberProps: MatchQualWithTeamNumberProps = {
    qual: 2,
    alliance: "blue",
    initialLocation: "middle"
  }
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-3  mx-auto">
      <div className="w-[480px] border-2 border-green-500 rounded-lg p-5 flex flex-col gap-3 py-0 h-15">
        <div className="flex w-[460px] justify-between items-center text-green-500 pr-[4px] h-50">
          <div>Scouter Name:</div>
          <input
            type="text"
            className="inputStyle w-[340px] h-full"
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
      <div className="w-[480px] border-2 border-green-500 rounded-lg p-5 flex flex-col gap-3 py-0 h-15">
        <div className="flex w-[460px] justify-between items-center text-green-500 pr-[4px] h-30">
          <div>Match Number:</div>
          <input
            type="number"
            className="inputStyle w-[335px] h-full"
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
      <div className="w-[480px] border-2 border-green-500 rounded-lg p-5 flex flex-col gap-3 py-0 h-15">
        <div className="flex w-[460px] justify-between items-center text-green-500 pr-[4px] h-70">
          <div>Match Type:</div>
          <select
            className="inputStyle w-[363px] h-full"
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
      <div className="w-[480px] border-2 border-green-500 rounded-lg p-5 flex flex-col gap-3 py-0 h-15">
        <div className="flex w-[460px] justify-between items-center text-green-500 pr-[4px] h-70">
          <div>Team Number:</div>
          <input
            type="number"
            className="inputStyle w-[340px] h-full"
            min={0}
            max={TEAM_NUMBER_MAX}
            value={matchQualWithTeamNumber(matchQualWithTeamNumberProps)}
            onChange={(event) => {
              setForm((prev) => ({
                ...prev,
                teamNumber: Number(event.target.value),
              }));
            }}
          />
        </div>
      </div>
    </div>
  );
};

export { PreMatchTab };
