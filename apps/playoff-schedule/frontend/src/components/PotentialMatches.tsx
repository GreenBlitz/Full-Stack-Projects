// בס"ד
import type React from "react";
import type { NextMatches } from "../utils/bracketUtils";
import type { AllianceSimpleType } from "../endpoints/AlliancesSimple";
import { ScenarioCard } from "./ScenarioCard";

interface PotentialMatchesProps {
  nextMatches: NextMatches;
  teamNameMap: Record<string, string>;
  isRedAlliance: boolean;
  alliances: AllianceSimpleType[];
}

interface ColorScheme {
  bg: string;
  border: string;
  text: string;
}

const colorSchemes: { win: ColorScheme; loss: ColorScheme } = {
  win: {
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-200 dark:border-green-800",
    text: "text-green-700 dark:text-green-400",
  },
  loss: {
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-700 dark:text-red-400",
  },
};

export const PotentialMatches: React.FC<PotentialMatchesProps> = ({
  nextMatches,
  teamNameMap,
  alliances,
}) => {
  if (!nextMatches.ifWin && !nextMatches.ifLoss) {
    return null;
  }

  return (
    <div className="mt-4 border-t-2 border-gray-300 dark:border-gray-600 pt-4">
      <div className="text-md font-bold uppercase text-gray-700 dark:text-gray-300 mb-4">
        <u>Predictions for the next Match</u>
      </div>
      <div className="space-y-4">
        <ScenarioCard
          match={nextMatches.ifWin}
          label="If Win:"
          colorScheme={colorSchemes.win}
          teamNameMap={teamNameMap}
          alliances={alliances}
        />
        <ScenarioCard
          match={nextMatches.ifLoss}
          label="If Loss:"
          colorScheme={colorSchemes.loss}
          teamNameMap={teamNameMap}
          alliances={alliances}
        />
      </div>
    </div>
  );
};
