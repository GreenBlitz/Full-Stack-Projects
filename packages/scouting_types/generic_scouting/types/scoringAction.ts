import { z } from "zod";
import { IdSchema, SourceListSchema } from "./buildingBlocks";


export const ScoreActionDefSchema = z.object({
  id: IdSchema,
  label: z.string(),
  objectId: IdSchema,
  locationId: IdSchema,
  allowedPhases: z.array(IdSchema).min(1),
  pointsPerPhase: z.record(z.string(), z.number()),
  sources: SourceListSchema,
});
export type ScoreActionDef = z.infer<typeof ScoreActionDefSchema>;
