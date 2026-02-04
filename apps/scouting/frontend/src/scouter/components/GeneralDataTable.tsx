//בס"ד
import { createColumnHelper } from "@tanstack/react-table";
import type { GameTime, TeamNumberAndFuelData } from "@repo/scouting_types";
import type React from "react";
import { useState } from "react";

const fetchFuelData = async (filters = {}) => {
  const queryString = new URLSearchParams(filters).toString();
  const url = `/api/v1/general/${queryString ? `?${queryString}` : ""}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server Error: ${errorText}`);
    }

    const data = await response.json();

    return data.calculatedFuel as TeamNumberAndFuelData[];
  } catch (err) {
    console.error("Fetch failed:", err);
    throw err;
  }
};

interface GeneralDataTableProps {
  filters: string[];
}

const GeneralDataTable: React.FC<GeneralDataTableProps> = ({ filters }) => {
  const [gameTime, setGameTime] = useState<GameTime>();
  const columnHelper = createColumnHelper<TeamNumberAndFuelData>();

  return <></>;
};
