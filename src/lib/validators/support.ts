import { z } from "zod";

export const supportSchema = z.object({
  name: z.string().min(3, "Too short"),
  email: z.string().email(),
  message: z.string().min(10, "Too Short").max(500, "Maxx 500 Characters"),
});
