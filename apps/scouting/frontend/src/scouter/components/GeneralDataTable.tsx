//בס"ד

import type React from "react";

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

    return data.calculatedFuel as ;
  } catch (err) {
    console.error("Fetch failed:", err);
    throw err;
  }
};
const GeneralDataTable: React.FC = () => {
  return <></>;
};
