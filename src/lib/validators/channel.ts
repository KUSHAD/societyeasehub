import { z } from "zod";

export const channelSchema = z.object({
  name: z
    .string()
    .min(1, "Required")
    .max(12, "Maximum 12 Characters")
    .trim()
    .toLowerCase()
    .transform((_value) => _value.replace(/\s+/g, "-")),
});
