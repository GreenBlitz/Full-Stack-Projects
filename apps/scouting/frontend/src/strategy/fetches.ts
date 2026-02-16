//בס"ד
const formsUrl = "/api/v1/forms/";

export const fetchTeamNumbers = async () => {
  const url = `${formsUrl}teams`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server Error: ${errorText}`);
  }
  const data = await response.json();
  return data.teamNumbers.sort() as number[];
};
