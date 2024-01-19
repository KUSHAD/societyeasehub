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
        },
      });

      if (inviteExists && inviteExists?.status === "PENDING")
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invite already pending to this user",
        });

      if (!inviteExists) {
        const newInvite = await db.invite.create({
          data: {
            societyId,
            userId,
          },
        });

        return newInvite;
      }

      const updatedInvite = await db.invite.update({
        where: {
          inviteId: { societyId, userId },
        },
        data: {
          status: "PENDING",
        },
      });

      return updatedInvite;
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
  getUserPending: protectedProcedure.query(async ({ ctx: { db, session } }) => {
    const pending = await db.invite.findMany({
      where: {
        userId: session.user.id,
        status: "PENDING",
      },
      select: {
        society: {
          select: {
            name: true,
            id: true,
            _count: {
              select: {
                members: true,
              },
            },
          },
        },
      },
    });

    return pending;
  }),
  reject: protectedProcedure
    .input(
      z.object({
        societyId: z.string(),
      }),
    )
    .mutation(async ({ ctx: { db, session }, input: { societyId } }) => {
      const rejectedInvite = await db.invite.updateMany({
        where: {
          societyId,
          userId: session.user.id,
        },
        data: {
          status: "IGNORED",
        },
      });

      return rejectedInvite;
    }),
  accept: protectedProcedure
    .input(
      z.object({
        societyId: z.string(),
      }),
    )
    .mutation(async ({ ctx: { db, session }, input: { societyId } }) => {
      const societyExists = await db.society.findUnique({
        where: { id: societyId },
      });

      if (!societyExists)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      const newMember = await db.member.create({
        data: {
          userId: session.user.id,
          societyId,
        },
      });

      await db.invite.updateMany({
        where: {
          societyId,
          userId: session.user.id,
        },
        data: {
          status: "ACCEPTED",
        },
      });

      return newMember;
    }),
});
