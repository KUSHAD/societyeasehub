import { z } from "zod";

export const updateCardSchema = z.object({
  title: z.string().min(3, "Too short").max(25, "Max 25 Characters"),
  description: z
    .string()
    .min(3, "Too short")
    .max(100, "Max 100 Characters")
    .optional(),
});
