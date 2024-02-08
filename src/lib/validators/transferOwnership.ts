import { z } from "zod";

export const transferOwnershipSchema = z.object({
  transferringTo: z.string().min(1, "Required"),
  password: z
    .string()
    .min(6, "Mininum 6 characters for password")
    .max(16, "Max 16 characers for password"),
});
