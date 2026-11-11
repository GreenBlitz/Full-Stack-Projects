import { z } from "zod";

const matchSchema = z
  .object({
    type: z.literal("test"),
  })
  .or(
    z.object({
      type: z
        .literal("practice")
        .or(z.literal("qual"))
        .or(z.literal("elimination")),
      number: z.number(),
    }),
  );

type Match = z.infer<typeof matchSchema>;

function stringToMatch(string: string): Match {
  switch (string.charAt(0)) {
    case "P":
      return { type: "practice", number: Number(string.substring(1)) };
    case "Q":
      return { type: "qual", number: Number(string.substring(1)) };
    case "E":
      return { type: "elimination", number: Number(string.substring(1)) };
    default:
      return { type: "test" };
  }
}

const logFileSchema = z.object({
  name: z.string(),
  file: z.instanceof(Express.Multer.File),
  date: z.date(),
  match: matchSchema,
});

type LogFile = z.infer<typeof logFileSchema>;

function stringToDate(string: string) {
  const year = Number(string.slice(0, 4));
  const month = Number(string.slice(4, 6));
  const day = Number(string.slice(6, 8));
  const hour = Number(string.slice(9, 11));
  const minute = Number(string.slice(11, 13));
  const second = Number(string.slice(13));
  return new Date(year, month, day, hour, minute, second);
}

export function fileToLogFile(file: Express.Multer.File): LogFile {
  const name = file.originalname;
  const date = stringToDate(name.slice(7, 22));
  const match = stringToMatch(
    name.slice(name.lastIndexOf("_") + 1, name.lastIndexOf(".")),
  );
  return { name, file, date, match };
}

export const drivingScoresSchema = z.object({
  joystickNormSpeedPeaks: z.number(),
  joystickAngleSpeedPeaks: z.number(),
});

export const drivingDataSchema = z.object({
  log: logFileSchema,
  scores: drivingScoresSchema,
});

export type DrivingData = z.infer<typeof drivingDataSchema>;
