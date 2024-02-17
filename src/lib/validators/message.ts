import { z } from "zod";

export const messageSchema = z.object({
  content: z.string().min(1, "Required").max(500, "Max 500 Characters"),
});
