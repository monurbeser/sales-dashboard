import { z } from "zod";

import { DEFAULT_YEAR } from "@/lib/constants";

export const managerSchema = z.object({
  fullName: z.string().min(2, "Ad soyad zorunludur").max(120)
});

export const monthSchema = z.number().int().min(1).max(12);

export const amountSchema = z.number().min(0);

export const targetItemSchema = z.object({
  month: monthSchema,
  amount: amountSchema.nullable()
});

export const bulkTargetsSchema = z.object({
  managerId: z.string().uuid(),
  year: z.literal(DEFAULT_YEAR),
  items: z.array(targetItemSchema)
});

export const bulkActualsSchema = z.object({
  managerId: z.string().uuid(),
  year: z.literal(DEFAULT_YEAR),
  items: z.array(targetItemSchema)
});
