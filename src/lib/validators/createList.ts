import { z } from "zod";

export const createListSchema = z.object({
  title: z.string().min(3, "Too short").max(25, "Max 25 characters"),
});
