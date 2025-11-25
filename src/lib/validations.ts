import { z } from "zod";

export const timeEntrySchema = z.object({
  checkIn: z.string().datetime(),
  checkOut: z.string().datetime().optional(),
  notes: z.string().max(500, "Notizen dürfen maximal 500 Zeichen lang sein").optional(),
});

export const breakSchema = z.object({
  start: z.string().datetime(),
  end: z.string().datetime().optional(),
});

export type TimeEntryInput = z.infer<typeof timeEntrySchema>;
export type BreakInput = z.infer<typeof breakSchema>;
