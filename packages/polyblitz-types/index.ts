import { z } from "zod";

export const UserSchema = z.object({
  name: z.string(),
  id: z.number(),
  money: z.number(),
  isAdmin: z.boolean(),
});

export const WagerSchema = z.object({
  userID: z.number(),
  amountWagered: z.number(),
});

export const BetOptionSchema = z.object({
  title: z.string(),
  wagers: z.array(WagerSchema),
});

export const BetSchema = z.object({
  title: z.string(),
  id: z.number(),
  description: z.string(),
  closesAt: z.number(), // Unix timestamp in milliseconds
  optionOne: BetOptionSchema,
  optionTwo: BetOptionSchema,
  isPending: z.boolean(),
});

export type User = z.infer<typeof UserSchema>;
export type Wager = z.infer<typeof WagerSchema>;
export type BetOption = z.infer<typeof BetOptionSchema>;
export type bet = z.infer<typeof BetSchema>;
