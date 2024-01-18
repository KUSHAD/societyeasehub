import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const inviteRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        societyId: z.string(),
      }),
    )
    .mutation(async ({ ctx: { db }, input: { societyId, userId } }) => {
      const societyExists = await db.society.findUnique({
        where: { id: societyId },
      });

      if (!societyExists)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      const userExists = await db.user.findUnique({
        where: { id: userId },
      });

      if (!userExists)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      const inviteExists = await db.invite.findFirst({
        where: {
          societyId,
          userId,
          status: "PENDING",
        },
      });

      if (inviteExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invite already sent to this user",
        });

      const newInvite = await db.invite.create({
        data: {
          societyId,
          userId,
        },
      });

      return newInvite;
    }),
  getPendingCount: protectedProcedure.query(
    async ({ ctx: { db, session } }) => {
      const pendingCount = await db.invite.count({
        where: {
          userId: session.user.id,
          status: "PENDING",
        },
      });

      return pendingCount;
    },
  ),
});
