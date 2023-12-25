import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const societyMediaRouter = createTRPCRouter({
  getSocietyMedia: protectedProcedure
    .input(
      z.object({
        societyId: z.string(),
      }),
    )
    .query(async ({ ctx: { db }, input: { societyId } }) => {
      const medias = await db.societyMedia.findMany({
        where: {
          societyId,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          uri: true,
        },
      });

      return medias;
    }),
});
