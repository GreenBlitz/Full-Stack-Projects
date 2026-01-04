// בס"ד
import type React from "react";
import { targetTeamKey, sliceStart } from "../config/frcConfig";

interface AllianceProps {
  teamKeys: string[];
  teamNameMap: Map<string, string>;
  allianceColor: "red" | "blue";
  isTargetTeamInAlliance: boolean;
}

export const Alliance: React.FC<AllianceProps> = ({
  teamKeys,
  teamNameMap,
  allianceColor,
  isTargetTeamInAlliance,
}) => {
  const colorClasses = {
    red: {
      border: "border-red-400 dark:border-red-500",
      bg: "bg-gray-100 dark:bg-gray-700/50",
      text: "text-red-700 dark:text-red-400",
      badge: "bg-red-700 dark:bg-red-600",
    },
    blue: {
      border: "border-blue-400 dark:border-blue-500",
      bg: "bg-gray-100 dark:bg-gray-700/50",
      text: "text-blue-700 dark:text-blue-400",
      badge: "bg-blue-700 dark:bg-blue-600",
    },
  };

  const colors = colorClasses[allianceColor];

  return (
    <div
      className={`flex-1 border-t-4 p-4 ${
        allianceColor === "red" ? "" : "border-l"
      } ${colors.border} ${isTargetTeamInAlliance ? colors.bg : "bg-white dark:bg-gray-800"}`}
    >
      <div className={`mb-2 text-sm font-bold uppercase ${colors.text}`}>
        {allianceColor === "red" ? "Red" : "Blue"} Alliance
      </div>
      {teamKeys.map((teamKey) => {
        const teamNumber = teamKey.slice(sliceStart);
        const teamName = teamNameMap.get(teamKey) ?? "Unknown";
        const isTargetTeam = teamKey === targetTeamKey;
        return (
          <div
            key={teamKey}
            className={`mb-1.5 flex items-center ${
              isTargetTeam ? "font-bold " : "font-normal"
            }`}
          >
            <span className="w-12 font-bold text-gray-800 dark:text-gray-200">
              {teamNumber}
            </span>
            <span className={`truncate text-sm ${
              isTargetTeam ? "text-green-600 dark:text-green-500" : "text-gray-600 dark:text-gray-300"
            }`}>
              {teamName}
            </span>
            {isTargetTeam && (
              <span
                className={`ml-auto rounded px-1.5 py-0.5 text-[10px] text-white ${colors.badge}`}
              >
                YOU
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
