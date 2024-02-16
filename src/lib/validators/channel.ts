import { z } from "zod";

export const channelSchema = z.object({
  name: z
    .string()
    .min(1, "Required")
    .max(12, "Maximum 12 Characters")
    .toLowerCase(),
});
