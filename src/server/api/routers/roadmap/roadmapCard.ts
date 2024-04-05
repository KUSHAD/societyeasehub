import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { createCardSchema } from "~/lib/validators/createCard";
import { canManageRoadmaps } from "~/actions/checkUserRole";
import { TRPCError } from "@trpc/server";

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
});
