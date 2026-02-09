//בס"ד

import type { TeamCompareData } from "@repo/scouting_types";
import type { FC } from "react";

const compareUrl = "/api/v1/compare/";

const fetchTeamCompareData = async (teamNumber: number) => {
  const params = new URLSearchParams({ teamNumber: teamNumber.toString() });
  const url = `${compareUrl}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server Error: ${errorText}`);
    }

    const data = await response.json();
    return data.teamCompareData as TeamCompareData;
  } catch (err) {
    console.error("Fetch failed:", err);
    throw err;
  }
};

const fetchTeamNumbers = async () => {
  const url = `${compareUrl}teams`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server Error: ${errorText}`);
    }

    const data = await response.json();
    return data.teamNumbers as number[];
  } catch (err) {
    console.error("Fetch failed:", err);
    throw err;
  }
};

const CompareTwo: FC = () => {
  return <></>;
};
