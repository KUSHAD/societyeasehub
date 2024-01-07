import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const memberRouter = createTRPCRouter({
  getBySociety: protectedProcedure
    .input(
      z.object({
        societyId: z.string(),
      }),
    )
    .query(async ({ ctx: { db }, input: { societyId } }) => {
      const members = await db.member.findMany({
        where: {
          societyId,
        },

        select: {
          role: {
            select: {
              name: true,
            },
          },
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });

      return members;
    }),
});
