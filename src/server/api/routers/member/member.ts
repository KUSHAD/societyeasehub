import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
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
          id: {
            societyId,
            userId,
          },
        },
        select: {
          roleId: true,
        },
      });

      return userRole?.roleId ?? "";
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
          id: {
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

  exitSociety: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx: { db, session }, input: { societyId } }) => {
      const removedMember = await db.member.delete({
        where: {
          id: {
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
          id: {
            societyId,
            userId,
          },
        },
      });

      return removedMember;
    }),
  getBySocietyWithoutOwner: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
      }),
    )
    .query(
      async ({
        ctx: {
          db,
          session: { user },
        },
        input: { societyId },
      }) => {
        const isOwner = await isSocietyOwner(societyId, user.id);

        if (!isOwner) throw new TRPCError({ code: "FORBIDDEN" });

        const members = await db.member.findMany({
          where: {
            societyId,
            NOT: {
              userId: user.id,
            },
          },
          select: {
            userId: true,
            user: {
              select: { name: true, image: true },
            },
          },
        });

        return members.map((_member) => ({
          id: _member.userId,
          name: _member.user.name ?? "User",
          image:
            _member.user.image ??
            "https://res.cloudinary.com/dst2pmia1/image/upload/c_crop,h_300,w_300/default_profile_pic.jpg",
        }));
      },
    ),

  getDetails: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
        userId: z.string().cuid(),
      }),
    )
    .query(async ({ ctx: { db }, input: { societyId, userId } }) => {
      const member = await db.member.findUnique({
        where: {
          id: {
            societyId,
            userId,
          },
        },
      });

      if (!member) return false;

      return true;
    }),
});
