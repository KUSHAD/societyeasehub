import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  canAssignRoles,
  canKickMember,
  isSocietyOwner,
} from "~/actions/checkUserRole";
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
  canAccessSettings: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
      }),
    )
    .query(async ({ ctx: { db, session }, input: { societyId } }) => {
      const dbSociety = await db.society.findUnique({
        where: {
          id: societyId,
        },
      });

      if (!dbSociety) throw new TRPCError({ code: "NOT_FOUND" });

      const memberPerms = await db.member.findUnique({
        where: {
          memberId: {
            societyId,
            userId: session.user.id,
          },
        },
        select: {
          role: {
            select: {
              accessSettings: true,
            },
          },
        },
      });

      if (!memberPerms) throw new TRPCError({ code: "NOT_FOUND" });

      if (!memberPerms.role) return false;
      return memberPerms.role.accessSettings;
    }),
  exitSociety: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx: { db, session }, input: { societyId } }) => {
      const removedMember = await db.member.delete({
        where: {
          memberId: {
            societyId,
            userId: session.user.id,
          },
        },
      });

      return removedMember;
    }),
  kick: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
        userId: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx: { db }, input: { societyId, userId } }) => {
      const canKick = await canKickMember(societyId);

      if (!canKick) throw new TRPCError({ code: "FORBIDDEN" });

      const isOwner = await isSocietyOwner(societyId, userId);

      if (isOwner) throw new TRPCError({ code: "FORBIDDEN" });

      const removedMember = await db.member.delete({
        where: {
          memberId: {
            societyId,
            userId,
          },
        },
      });

      return removedMember;
    }),
});
