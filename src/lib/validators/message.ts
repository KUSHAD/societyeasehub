import { z } from "zod";

export const messageSchema = z.object({
  content: z.string().min(1, "Required").max(200, "Max 200 Characters"),
});
