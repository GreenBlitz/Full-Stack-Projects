//בס"ד
import React, { type FC, type Dispatch, type SetStateAction } from "react";
import type { TabProps } from "./scouter/pages/ScoutMatch";
import type { Alliance } from "@repo/scouting_types";
const MATCH_NUMBER_MAX = 127;
const TEAM_NUMBER_MAX = 16383;

type initialLocation = "close" | "middle" | "far";

interface MatchQualWithTeamNumberProps {
  qual: number;
  alliance: Alliance;
  initialLocation: initialLocation;
}

const matchQualWithTeamNumber = (
  matchQualWithTeamNumberProps: MatchQualWithTeamNumberProps,
) => {
  const DEFAULT_TEAM_NUMBER = 4590;
  const CALIBERATION_CONSTANT = 1;
  const CLOSE_INDEX = 0;
  const MIDDLE_INDEX = 1;
  const FAR_INDEX = 2;
  const allMatches = await fetchAllAwaitingMatches();
  if (
    !allMatches?.[matchQualWithTeamNumberProps.qual - CALIBERATION_CONSTANT]
  ) {
    console.error("Match data is unavailable");
    return DEFAULT_TEAM_NUMBER;
  }
  const match =
    allMatches[matchQualWithTeamNumberProps.qual - CALIBERATION_CONSTANT];

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
    </div>
  );
};

export { PreMatchTab };
