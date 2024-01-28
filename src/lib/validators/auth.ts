import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Required",
    })
    .min(1, "Required")
    .email("Invalid Email"),
  password: z
    .string({
      required_error: "Required",
    })
    .min(6, "Minimum 6 Characters")
    .max(16, "Maximum 16 Characters"),
});
