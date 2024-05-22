import { z } from "zod";
import { getTime, differenceInDays } from "date-fns";

export const createPollSchema = z
  .object({
    question: z.string().min(1, "Required").max(50, "Max 50 characters"),
    options: z
      .array(
        z.object({
          name: z.string().min(1, "Required").max(50, "Max 50 characters"),
        }),
      )
      .nonempty("Options can't be empty")
      .min(2, "Min 2 options for poll")
      .max(4, "Max 4 Options For Poll"),
    validTill: z.coerce
      .date()
      .refine((value) => getTime(value) > getTime(Date.now()), {
        message: "Should be  more than current Date",
      }),
  })
  .superRefine(({ validTill }, ctx) => {
    if (differenceInDays(validTill, getTime(Date.now())) > 7) {
      ctx.addIssue({
        code: "custom",
        message: "Poll can be maximum valid for 7 days",
        path: ["validTill"],
      });
    }
  });
