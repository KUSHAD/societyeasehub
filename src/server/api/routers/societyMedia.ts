import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { utapi } from "~/server/storage";
import { canAccessSettings } from "~/actions/checkUserRole";

export const societyMediaRouter = createTRPCRouter({
  getBySociety: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
      }),
    )
    .query(async ({ ctx: { db }, input: { societyId } }) => {
      const canAccess = await canAccessSettings(societyId);

      if (!canAccess) throw new TRPCError({ code: "FORBIDDEN" });

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
        id: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx: { db }, input: { id } }) => {
      const dbMedia = await db.societyMedia.findUnique({
        where: {
          id: id,
        },
        select: {
          id: true,
          uri: true,
          societyId: true,
        },
      });

      if (!dbMedia) throw new TRPCError({ code: "NOT_FOUND" });

      const canAccess = await canAccessSettings(dbMedia.societyId);

      if (!canAccess) throw new TRPCError({ code: "FORBIDDEN" });
      const media = await db.societyMedia.delete({
        where: {
          id: id,
        },
        select: {
          id: true,
          uri: true,
        },
      });

      const fileKey = media.uri.split("/f/")[1]!;

      await utapi.deleteFiles(fileKey);

      return media;
    }),
});
