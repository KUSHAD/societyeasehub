import { z } from "zod";

export const createCardSchema = z.object({
  title: z.string().min(3, "Too short").max(25, "Max 25 Characters"),
});
