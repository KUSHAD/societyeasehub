import { z } from "zod";

export const newRole = z.object({
  name: z
    .string({
      required_error: "Required",
    })
    .min(1, "Required")
    .max(25, "Max 25 Characters"),
  accessSettings: z.boolean().optional().default(false),
  createInvite: z.boolean().optional().default(false),
  assignRole: z.boolean().optional().default(false),
  kickUser: z.boolean().optional().default(false),
});
