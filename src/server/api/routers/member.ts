import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { canAssignRoles } from "~/actions/checkUserRole";
import { TRPCError } from "@trpc/server";

export const memberRouter = createTRPCRouter({
  getBySociety: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
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
              id: true,
            },
          },
        },
      });

      return members;
    }),
  getRole: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
        userId: z.string().cuid(),
      }),
    )
    .query(async ({ ctx: { db }, input: { societyId, userId } }) => {
      const canAssign = await canAssignRoles(societyId);

      if (!canAssign)
        throw new TRPCError({
          code: "FORBIDDEN",
        });

      const userRole = await db.member.findUnique({
        where: {
          memberId: {
            societyId,
            userId,
          },
        },
        select: {
          roleId: true,
        },
      });

      return userRole?.roleId ?? undefined;
    }),
  assignRole: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
        userId: z.string().cuid(),
        roleId: z.string().cuid().nullable(),
      }),
    )
    .mutation(async ({ ctx: { db }, input: { roleId, societyId, userId } }) => {
      const canAssign = await canAssignRoles(societyId);

      if (!canAssign)
        throw new TRPCError({
          code: "FORBIDDEN",
        });

      const newMember = await db.member.update({
        where: {
          memberId: {
            societyId,
            userId,
          },
        },
        data: {
          roleId,
        },
      });

      return newMember;
    }),
});
