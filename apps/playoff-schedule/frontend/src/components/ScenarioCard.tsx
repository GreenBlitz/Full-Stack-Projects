// בס"ד
import type React from "react";
import type { PotentialMatch } from "../utils/bracketTypes";
import type { AllianceSimpleType } from "../endpoints/AlliancesSimple";
import { MatchInfo } from "./MatchInfo";

interface ColorScheme {
  bg: string;
  border: string;
  text: string;
}

interface ScenarioCardProps {
  match: PotentialMatch | null;
  label: string;
  colorScheme: ColorScheme;
  teamNameMap: Record<string, string>;
  alliances: AllianceSimpleType[];
}

const getAllianceColorClass = (alliance: "red" | "blue" | null) => {
  if (alliance === "red") return "text-red-700 dark:text-red-400";
  if (alliance === "blue") return "text-blue-700 dark:text-blue-400";
  return "text-gray-500 dark:text-gray-400";
};

const getAllianceLabel = (alliance: "red" | "blue" | null) => {
  if (alliance === "red") return "Red";
  if (alliance === "blue") return "Blue";
  return "TBD";
};

export const ScenarioCard: React.FC<ScenarioCardProps> = ({
  match,
  label,
  colorScheme,
  teamNameMap,
  alliances,
}) => {
  if (!match) return null;

  const ourAlliance = match.ourAlliance ?? null;

  return (
    <div
      className={`p-4 ${colorScheme.bg} rounded-lg border ${colorScheme.border}`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`font-bold ${colorScheme.text} min-w-[80px] text-base`}
        >
          {label}
        </span>
        <div className="flex-1">
          <div className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
            You are in:{" "}
            <span className={`font-bold ${getAllianceColorClass(ourAlliance)}`}>
              {getAllianceLabel(ourAlliance)} Alliance
            </span>
          </div>
          <MatchInfo
            match={match}
            teamNameMap={teamNameMap}
            alliances={alliances}
          />
        </div>
      </div>
    </div>
  );
};
