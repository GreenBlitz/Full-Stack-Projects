// Shared TBA fetcher to avoid duplicating auth + headers
const TBA_API_BASE = "https://www.thebluealliance.com/api/v3";

const getApiKey = (): string => {
  const key = process.env.TBA_API_KEY;
  if (!key) {
    throw new Error("Missing TBA_API_KEY in environment variables");
  }
  return key;
};

export const fetchTba = async <T>(path: string): Promise<T> => {
  const response = await fetch(TBA_API_BASE + path, {
    method: "GET",
    headers: {
      "X-TBA-Auth-Key": getApiKey(),
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error, status: ${response.status}`);
  }

  return response.json() as Promise<T>;
};
