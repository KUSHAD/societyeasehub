import { z } from "zod";
import { getTime, differenceInMinutes } from "date-fns";

export const createRoomSchema = z
  .object({
    title: z.string().min(1, "Required").max(50, "Max 50 Characters"),
    description: z.string().min(1, "Required").max(100, "Max 100 Characters"),
    type: z.enum(["AUDIO", "VIDEO"]).default("AUDIO"),
    startTime: z
      .string()
      .datetime()
      .refine((value) => Number(value) > getTime(Date.now()), {
        message: "Should be  more than current time",
      }),
    endTime: z.string().datetime(),
  })
  .superRefine(({ endTime, startTime }, ctx) => {
    if (Number(endTime) < Number(startTime)) {
      ctx.addIssue({
        code: "custom",
        message: "End Time should  be more than start time",
        path: ["endTime"],
      });
    }

    if (differenceInMinutes(Number(endTime), Number(startTime)) > 60) {
      ctx.addIssue({
        code: "custom",
        message: "Meeting can be maximum  of  1 hr",
        path: ["endTime"],
      });
    }
  });
