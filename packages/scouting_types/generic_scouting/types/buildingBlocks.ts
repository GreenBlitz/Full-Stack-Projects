import { z } from "zod";


export const IdSchema = z
  .string()
  .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, "id must start with a letter and contain only letters, digits and _");
export type Id = z.infer<typeof IdSchema>;
export type SourceId = Id;

export const IdListSchema = z.array(IdSchema);
export const SourceListSchema = z.array(IdSchema).min(1, "must list at least one source");


export const PhaseDefSchema = z.object({
  id: IdSchema, // "auto" | "teleop" | "endgame"...
  label: z.string(),
});
export type PhaseDef = z.infer<typeof PhaseDefSchema>;

export const GameObjectDefSchema = z.object({
  id: IdSchema, // "coral", "algae"...
  label: z.string(),
});
export type GameObjectDef = z.infer<typeof GameObjectDefSchema>;

export const LocationDefSchema = z.object({
  id: IdSchema, // "reef_l1", "net"...
  label: z.string(),
});
export type LocationDef = z.infer<typeof LocationDefSchema>;

export const SourceDefSchema = z.object({
  id: IdSchema,
  label: z.string(),
  defaultWeight: z.number().min(0),
});
export type SourceDef = z.infer<typeof SourceDefSchema>;