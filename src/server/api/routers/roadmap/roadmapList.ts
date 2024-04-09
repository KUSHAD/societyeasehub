import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { createListSchema } from "~/lib/validators/createList";
import { canManageRoadmaps } from "~/actions/checkUserRole";
import { TRPCError } from "@trpc/server";

export const roadmapListRouter = createTRPCRouter({
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
  delete: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
        listId: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx: { db }, input: { listId, societyId } }) => {
      const canAccess = await canManageRoadmaps(societyId);

      if (!canAccess)
        throw new TRPCError({
          code: "FORBIDDEN",
        });

      const list = await db.roadmapList.delete({
        where: {
          id: listId,
          societyId,
        },
      });

      return list;
    }),
  copy: protectedProcedure
    .input(
      z.object({
        listId: z.string().cuid(),
        societyId: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx: { db }, input: { listId, societyId } }) => {
      const canAccess = await canManageRoadmaps(societyId);

      if (!canAccess)
        throw new TRPCError({
          code: "FORBIDDEN",
        });

      const listToCopy = await db.roadmapList.findUnique({
        where: {
          id: listId,
          societyId,
        },
        include: {
          cards: true,
        },
      });

      if (!listToCopy)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "List not found",
        });

      const lastList = await db.roadmapList.findFirst({
        where: { societyId },
        orderBy: { order: "desc" },
        select: { order: true },
      });

      const newOrder = lastList ? lastList.order + 1 : 1;

      const list = await db.roadmapList.create({
        data: {
          societyId: listToCopy.societyId,
          title: `${listToCopy.title} - Copy`,
          order: newOrder,
          cards: {
            createMany: {
              data: listToCopy.cards.map((card) => ({
                title: card.title,
                description: card.description,
                order: card.order,
              })),
            },
          },
        },
        include: {
          cards: true,
        },
      });
      return list;
    }),
  reorder: protectedProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            order: z.number(),
          }),
        ),
        societyId: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx: { db }, input: { items, societyId } }) => {
      const canAccess = await canManageRoadmaps(societyId);

      if (!canAccess)
        throw new TRPCError({
          code: "FORBIDDEN",
        });

      const transaction = items.map((list) =>
        db.roadmapList.update({
          where: {
            id: list.id,
            societyId,
          },
          data: {
            order: list.order,
          },
        }),
      );
      const lists = await db.$transaction(transaction);
      return lists;
    }),
  updateTitle: protectedProcedure
    .input(
      createListSchema.and(
        z.object({ societyId: z.string().cuid(), listId: z.string().cuid() }),
      ),
    )
    .mutation(async ({ ctx: { db }, input: { listId, societyId, title } }) => {
      const canAccess = await canManageRoadmaps(societyId);

      if (!canAccess)
        throw new TRPCError({
          code: "FORBIDDEN",
        });

      const list = await db.roadmapList.update({
        where: {
          id: listId,
          societyId,
        },
        data: { title },
      });

      return list;
    }),
});
