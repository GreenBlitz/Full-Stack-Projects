// בס"ד
import { Router } from "express";
import { StatusCodes } from "http-status-codes";

const tbaRouter = Router();

const getApiKey = (): string => {
  const key = process.env.TBA_API_KEY;
  if (!key) {
    throw new Error("Missing TBA_API_KEY in environment variables");
  }
  return key;
};


export const fetchData = async (url: string): Promise<unknown> => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-TBA-Auth-Key": getApiKey(),
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error, status: ${response.status}`);
  }

  const data = await response.json();
  console.log("TBA data:", data);
  return data;
};


tbaRouter.get("/fetch", async (req, res) => {
  try {
    const encodedUrl = req.query.url;

    if (!encodedUrl || typeof encodedUrl !== "string") {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "missing url param" });
      return;
    }

    const fullUrl = decodeURIComponent(encodedUrl);
    console.log("Incoming /tba/fetch with url:", fullUrl);

    const data = await fetchData(fullUrl);
    res.status(StatusCodes.OK).json(data);
  } catch (error) {
    console.error("Error in /tba/fetch:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to fetch data" });
  }
});

export { tbaRouter };
