import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { canManageChannels } from "~/actions/checkUserRole";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import _ from "lodash";

export const channelAccessRoleRouter = createTRPCRouter({
  getAccessRoles: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
        channelId: z.string().cuid(),
      }),
    )
    .query(async ({ ctx: { db }, input: { channelId, societyId } }) => {
      const canAccess = await canManageChannels(societyId);

      if (!canAccess)
        throw new TRPCError({
          code: "FORBIDDEN",
        });

      const data = await db.channelAccessRole.findMany({
        where: {
          channelId,
          societyId,
        },
        select: {
          role: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      });

      return data.map((_) => _.role);
    }),
  getNoAccessRoles: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
        channelId: z.string().cuid(),
      }),
    )
    .query(async ({ ctx: { db }, input: { channelId, societyId } }) => {
      const canAccess = await canManageChannels(societyId);

      if (!canAccess)
        throw new TRPCError({
          code: "FORBIDDEN",
        });

      const _societyRoles = await db.role.findMany({
        where: {
          societyId,
        },
        select: { id: true },
      });

      const societyRoles = _societyRoles.map((_) => _.id);

      const _channelRoles = await db.channelAccessRole.findMany({
        where: {
          channelId,
          societyId,
        },
        select: {
          role: {
            select: {
              id: true,
            },
          },
        },
      });

      const channelRoles = _channelRoles.map((_) => _.role.id);

      const requiredRoles = _.difference(societyRoles, channelRoles);

      const data = await db.role.findMany({
        where: {
          id: {
            in: requiredRoles,
          },
          societyId,
        },
        select: {
          name: true,
          id: true,
        },
      });

      return data;
    }),
  create: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
        channelId: z.string().cuid(),
        roleId: z.string().cuid(),
      }),
    )
    .mutation(
      async ({ ctx: { db }, input: { channelId, roleId, societyId } }) => {
        const canAccess = await canManageChannels(societyId);

        if (!canAccess)
          throw new TRPCError({
            code: "FORBIDDEN",
          });

        const data = await db.channelAccessRole.create({
          data: {
            channelId,
            roleId,
            societyId,
          },
        });

        return data;
      },
    ),
  delete: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
        channelId: z.string().cuid(),
        roleId: z.string().cuid(),
      }),
    )
    .mutation(
      async ({ ctx: { db }, input: { channelId, roleId, societyId } }) => {
        const canAccess = await canManageChannels(societyId);

        if (!canAccess)
          throw new TRPCError({
            code: "FORBIDDEN",
          });

        const data = await db.channelAccessRole.delete({
          where: {
            id: { channelId, roleId, societyId },
          },
        });

        return data;
      },
    ),
});
