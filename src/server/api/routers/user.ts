import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export const userRouter = createTRPCRouter({
  updateName: protectedProcedure
    .input(
      z.object({
        name: z
          .string({
            required_error: "Name is required",
          })
          .max(25, "Maximum 25 Characters")
          .min(1, "Required"),
      }),
    )
    .mutation(async ({ ctx: { db, session }, input: { name } }) => {
      const updatedName = await db.user.update({
        where: {
          email: session.user.email!,
        },
        data: {
          name: name,
        },
        select: {
          name: true,
        },
      });
      revalidatePath("/profile", "page");
      return { updatedName: updatedName.name! };
    }),
});
