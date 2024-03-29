import { z } from "zod";
import { getTime, differenceInMinutes, parseISO } from "date-fns";

export const createRoomSchema = z
  .object({
    title: z.string().min(1, "Required").max(50, "Max 50 Characters"),
    description: z.string().min(1, "Required").max(100, "Max 100 Characters"),
    startTime: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
      .refine((value) => getTime(parseISO(value)) > getTime(Date.now()), {
        message: "Should be  more than current time",
      }),
    endTime: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/),
  })
  .superRefine(({ endTime, startTime }, ctx) => {
    if (differenceInMinutes(parseISO(endTime), parseISO(startTime)) === 0) {
      ctx.addIssue({
        code: "custom",
        message: "End time and start time can't be same",
        path: ["endTime"],
      });
    }

    if (differenceInMinutes(parseISO(endTime), parseISO(startTime)) > 60) {
      ctx.addIssue({
        code: "custom",
        message: "Meeting can be maximum  of 1 hr",
        path: ["endTime"],
      });
    }

    if (differenceInMinutes(parseISO(endTime), parseISO(startTime)) < 0) {
      ctx.addIssue({
        code: "custom",
        message: "End Time should  be more than start time",
        path: ["endTime"],
      });
    }
  });
