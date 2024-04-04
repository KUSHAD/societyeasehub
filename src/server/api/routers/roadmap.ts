import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createListSchema } from "~/lib/validators/createList";
import { canManageRoadmaps } from "~/actions/checkUserRole";
import { TRPCError } from "@trpc/server";

export const roadmapRouter = createTRPCRouter({
  getBySociety: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
      }),
    )
    .query(async ({ ctx: { db }, input: { societyId } }) => {
      const list = await db.roadmapList.findMany({
        where: {
          societyId,
        },
        include: {
          cards: {
            orderBy: {
              order: "asc",
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      });

      return list;
    }),
  createList: protectedProcedure
    .input(
      createListSchema.and(
        z.object({
          societyId: z.string().cuid(),
        }),
      ),
    )
    .mutation(async ({ ctx: { db }, input }) => {
      const canAccess = await canManageRoadmaps(input.societyId);

      if (!canAccess)
        throw new TRPCError({
          code: "FORBIDDEN",
        });

      const lastList = await db.roadmapList.findFirst({
        where: { societyId: input.societyId },
        orderBy: { order: "desc" },
        select: { order: true },
      });

      const newOrder = lastList ? lastList.order + 1 : 1;

      const list = await db.roadmapList.create({
        data: { ...input, order: newOrder },
      });

      return list;
    }),
});
