import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { utapi } from "~/server/storage";

export const societyMediaRouter = createTRPCRouter({
  getBySociety: protectedProcedure
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
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx: { db }, input: { id } }) => {
      const media = await db.societyMedia.delete({
        where: {
          id: id,
        },
        select: {
          id: true,
          uri: true,
        },
      });

      if (!media) throw new TRPCError({ code: "NOT_FOUND" });

      const fileKey = media.uri.split("/f/")[1]!;

      await utapi.deleteFiles(fileKey);

      return media;
    }),
});
