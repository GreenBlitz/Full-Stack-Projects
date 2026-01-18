// בס"ד
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { promises as fs } from "fs";
import { join } from "path";

export const apiRouter = Router();

const DATA_DIR = join(process.cwd(), "data");
const GAMES_FILE = join(DATA_DIR, "games.json");
const JSON_INDENTATION = 2;

const ensureDataDir = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error("Error creating data directory:", error);
  }
};

const readGames = async (): Promise<{ qual: string; startTime: string }[]> => {
  try {
    const data = await fs.readFile(GAMES_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading games file:", error);
    return [];
  }
};


const writeGames = async (games: { qual: string; startTime: string }[]) => {
  await ensureDataDir();
  await fs.writeFile(GAMES_FILE, JSON.stringify(games, null, JSON_INDENTATION), "utf-8");
};

apiRouter.get("/health", (req, res) => {
  res.status(StatusCodes.OK).send({ message: "Healthy!" });
});

apiRouter.post("/game/start", async (req, res) => {
  const { qual } = req.body;

  if (!qual) {
    res.status(StatusCodes.BAD_REQUEST).send({
      error: "Missing required fields: qual required",
    });
    return;
  }

  if (isNaN(Number(qual)) || qual.trim() === "") {
    res.status(StatusCodes.BAD_REQUEST).send({
      error: "Qual must be a valid number",
    });
    return;
  }

  const startTime = new Date().toISOString();
  const gameData = {
    qual: qual.trim(),
    startTime,
  };

  try {
    const games = await readGames();
    
    games.push(gameData);
    
    await writeGames(games);

    res.status(StatusCodes.OK).send({
      message: "Game started successfully",
      qual: gameData.qual,
      startTime: gameData.startTime,
    });
  } catch (error) {
    console.error("Error saving game data:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: "Failed to save game data",
    });
  }
});