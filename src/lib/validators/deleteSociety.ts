import { z } from "zod";

export const deleteSocietySchema = z.object({
  password: z
    .string()
    .min(6, "Mininum 6 characters for password")
    .max(16, "Max 16 characers for password"),
});
