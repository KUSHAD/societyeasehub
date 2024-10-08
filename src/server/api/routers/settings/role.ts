import { newRole } from "~/lib/validators/newRole";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { canAccessSettings } from "~/actions/checkUserRole";

export const rolesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      newRole.merge(
        z.object({
          societyId: z.string().cuid(),
        }),
      ),
    )
    .mutation(async ({ ctx: { db }, input }) => {
      const canCreate = await canAccessSettings(input.societyId);

      if (!canCreate) throw new TRPCError({ code: "FORBIDDEN" });

      const societyExists = await db.society.findUnique({
        where: { id: input.societyId },
      });

      if (!societyExists)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Society Not Found",
        });

      const newRole = await db.role.create({
        data: input,
      });

      return newRole;
    }),
  getBySociety: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
      }),
    )
    .query(async ({ ctx: { db }, input }) => {
      const societyExists = await db.society.findUnique({
        where: { id: input.societyId },
      });

      if (!societyExists)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Society Not Found",
        });

      const societyRoles = await db.role.findMany({
        where: {
          societyId: input.societyId,
        },
        select: {
          id: true,
          name: true,
          accessSettings: true,
          createInvite: true,
          assignRole: true,
          kickUser: true,
          manageChannel: true,
          sendMessage: true,
          createMeeting: true,
          manageRoadmap: true,
          manageAccounts: true,
          canAnnounce: true,
          canCreatePolls: true,
          canVote: true,
          canComment: true,
          _count: {
            select: {
              members: true,
            },
          },
        },
      });

      return societyRoles;
    }),
  getByID: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .query(async ({ ctx: { db }, input: { id } }) => {
      const dbRole = await db.role.findUnique({
        where: {
          id: id,
        },
      });

      if (!dbRole) throw new TRPCError({ code: "NOT_FOUND" });

      return dbRole;
    }),
  update: protectedProcedure
    .input(
      newRole.merge(
        z.object({
          id: z.string().cuid(),
        }),
      ),
    )
    .mutation(async ({ ctx: { db }, input }) => {
      const dbRole = await db.role.findUnique({
        where: {
          id: input.id,
        },
        select: { id: true, societyId: true },
      });

      if (!dbRole) throw new TRPCError({ code: "NOT_FOUND" });

      const canCreate = await canAccessSettings(dbRole.societyId);

      if (!canCreate) throw new TRPCError({ code: "FORBIDDEN" });

      const updatedRole = await db.role.update({
        where: { id: input.id },
        data: input,
      });
      return updatedRole;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx: { db }, input: { id } }) => {
      const dbRole = await db.role.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          _count: {
            select: { members: true },
          },
          societyId: true,
        },
      });

      if (!dbRole) throw new TRPCError({ code: "NOT_FOUND" });

      const canCreate = await canAccessSettings(dbRole.societyId);

      if (!canCreate) throw new TRPCError({ code: "FORBIDDEN" });

      if (dbRole._count.members !== 0)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This role has assigned members",
        });

      const deletedRole = await db.role.delete({
        where: {
          id,
        },
      });
      return deletedRole;
    }),
  assignAutoRole: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
        roleId: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx: { db }, input: { roleId, societyId } }) => {
      const canCreate = await canAccessSettings(societyId);

      if (!canCreate) throw new TRPCError({ code: "FORBIDDEN" });

      const autoRole = await db.autoRole.upsert({
        create: {
          roleId,
          societyId,
        },
        update: {
          roleId,
        },
        where: {
          societyId,
        },
      });

      return autoRole;
    }),
  getAutoRole: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
      }),
    )
    .query(async ({ ctx: { db }, input: { societyId } }) => {
      const canCreate = await canAccessSettings(societyId);

      if (!canCreate) throw new TRPCError({ code: "FORBIDDEN" });

      const autoRole = await db.autoRole.findUnique({
        where: { societyId },
      });

      if (!autoRole) throw new TRPCError({ code: "NOT_FOUND" });

      return autoRole.roleId;
    }),
});
