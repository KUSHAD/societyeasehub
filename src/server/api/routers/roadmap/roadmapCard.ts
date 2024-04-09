import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { createCardSchema } from "~/lib/validators/createCard";
import { canManageRoadmaps } from "~/actions/checkUserRole";
import { TRPCError } from "@trpc/server";
import { updateCardSchema } from "~/lib/validators/updateCard";

export const roadmapCardRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      createCardSchema.and(
        z.object({
          listId: z.string().cuid(),
          societyId: z.string().cuid(),
        }),
      ),
    )
    .mutation(async ({ ctx: { db }, input: { listId, societyId, title } }) => {
      const canAccess = await canManageRoadmaps(societyId);

      if (!canAccess)
        throw new TRPCError({
          code: "FORBIDDEN",
        });

      const list = await db.roadmapList.findUnique({
        where: {
          id: listId,
          societyId,
        },
      });

      if (!list) throw new TRPCError({ code: "NOT_FOUND" });

      const lastCard = await db.roadmapCard.findFirst({
        where: { listId },
        orderBy: { order: "desc" },
        select: { order: true },
      });

      const newOrder = lastCard ? lastCard.order + 1 : 1;

      const card = await db.roadmapCard.create({
        data: {
          title,
          listId,
          order: newOrder,
        },
      });

      return card;
    }),
  reorder: protectedProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            order: z.number(),
            listId: z.string(),
          }),
        ),
        societyId: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx: { db }, input: { societyId, items } }) => {
      const canAccess = await canManageRoadmaps(societyId);

      if (!canAccess)
        throw new TRPCError({
          code: "FORBIDDEN",
        });

      const transaction = items.map((card) =>
        db.roadmapCard.update({
          where: {
            id: card.id,
            list: {
              societyId,
            },
          },
          data: {
            order: card.order,
            listId: card.listId,
          },
        }),
      );

      const updatedCards = await db.$transaction(transaction);

      return updatedCards;
    }),
  getById: protectedProcedure
    .input(
      z.object({ cardId: z.string().cuid(), societyId: z.string().cuid() }),
    )
    .query(async ({ ctx: { db }, input: { cardId, societyId } }) => {
      const card = await db.roadmapCard.findUnique({
        where: {
          id: cardId,
          list: { societyId },
        },
        select: {
          id: true,
          description: true,
          title: true,
          list: { select: { title: true } },
        },
      });

      if (!card) throw new TRPCError({ code: "NOT_FOUND" });

      const formattedCard = {
        ...card,
        list: card.list.title,
        description: card.description ?? "Not Provided",
      };

      return formattedCard;
    }),
  edit: protectedProcedure
    .input(
      updateCardSchema.and(
        z.object({
          societyId: z.string().cuid(),
          cardId: z.string().cuid(),
        }),
      ),
    )
    .mutation(
      async ({
        ctx: { db },
        input: { cardId, societyId, title, description },
      }) => {
        const canAccess = await canManageRoadmaps(societyId);

        if (!canAccess)
          throw new TRPCError({
            code: "FORBIDDEN",
          });

        const card = await db.roadmapCard.update({
          where: {
            id: cardId,
            list: { societyId },
          },
          data: { title, description },
        });

        return card;
      },
    ),
  copy: protectedProcedure
    .input(
      z.object({
        listId: z.string().cuid(),
        societyId: z.string().cuid(),
        cardId: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx: { db }, input: { listId, societyId, cardId } }) => {
      const canAccess = await canManageRoadmaps(societyId);

      if (!canAccess)
        throw new TRPCError({
          code: "FORBIDDEN",
        });

      const cardToCopy = await db.roadmapCard.findUnique({
        where: {
          id: cardId,
          listId,
          list: { societyId },
        },
      });

      if (!cardToCopy)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Card not found",
        });

      const lastCard = await db.roadmapCard.findFirst({
        where: { listId, list: { societyId } },
        orderBy: { order: "desc" },
        select: { order: true },
      });

      const newOrder = lastCard ? lastCard.order + 1 : 1;

      const card = await db.roadmapCard.create({
        data: {
          listId: cardToCopy.listId,
          title: `${cardToCopy.title} - Copy`,
          order: newOrder,
        },
      });
      return card;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        cardId: z.string().cuid(),
        listId: z.string().cuid(),
        societyId: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx: { db }, input: { cardId, listId, societyId } }) => {
      const canAccess = await canManageRoadmaps(societyId);

      if (!canAccess)
        throw new TRPCError({
          code: "FORBIDDEN",
        });

      const card = await db.roadmapCard.delete({
        where: { id: cardId, listId, list: { societyId } },
      });

      return card;
    }),
});
