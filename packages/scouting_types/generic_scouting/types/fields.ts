import { z } from "zod";
import { IdSchema, SourceListSchema } from "./buildingBlocks";


const fieldBase = {
  id: IdSchema,
  label: z.string(),
  sources: SourceListSchema,
  phase: IdSchema.optional(),
};

export const CounterFieldSchema = z.object({ ...fieldBase, type: z.literal("counter") });
export type CounterField = z.infer<typeof CounterFieldSchema>;

export const BooleanFieldSchema = z.object({
  ...fieldBase,
  type: z.literal("boolean"),
  points: z.number().optional(),
});
export type BooleanField = z.infer<typeof BooleanFieldSchema>;

export const TextFieldSchema = z.object({ ...fieldBase, type: z.literal("text") });
export type TextField = z.infer<typeof TextFieldSchema>;

export const EnumOptionSchema = z.object({
  id: IdSchema,
  label: z.string(),
  points: z.number(),
});
export type EnumOption = z.infer<typeof EnumOptionSchema>;

export const EnumFieldSchema = z.object({
  ...fieldBase,
  type: z.literal("enum"),
  options: z.array(EnumOptionSchema).min(1),
});
export type EnumField = z.infer<typeof EnumFieldSchema>;

export const ScaleRatingFieldSchema = z.object({
  ...fieldBase,
  type: z.literal("rating"),
  min: z.number(),
  max: z.number(),
});
export type ScaleRatingField = z.infer<typeof ScaleRatingFieldSchema>;

export const FieldDefSchema = z.discriminatedUnion("type", [
  CounterFieldSchema,
  BooleanFieldSchema,
  TextFieldSchema,
  EnumFieldSchema,
  ScaleRatingFieldSchema,
]);
export type FieldDef = z.infer<typeof FieldDefSchema>;