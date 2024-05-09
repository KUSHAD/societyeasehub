import { z } from "zod";

export const announcementSchema = z.object({
  content: z.string().max(200, "Max 200 Characters").min(1, "Required"),
});
