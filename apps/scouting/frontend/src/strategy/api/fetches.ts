//בס"ד
const teamPageUrl = "/api/v1/teamPage/";

export const fetchTeamNumbers = async () => {
  const url = `${teamPageUrl}teamNumbers`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server Error: ${errorText}`);
  }
  const data = await response.json();
  return data.teamNumbers.map(Number).sort((a: number, b: number) => a - b);
};
