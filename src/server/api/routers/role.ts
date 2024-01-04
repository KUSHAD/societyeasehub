import { newRole } from "~/lib/validators/newRole";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const rolesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      newRole.merge(
        z.object({
          societyId: z.string(),
        }),
      ),
    )
    .mutation(async ({ ctx: { db }, input }) => {
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
  getSocietyRoles: protectedProcedure
    .input(
      z.object({
        societyId: z.string(),
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
          accessDanger: true,
          accessGeneral: true,
          accessRole: true,
          createInvite: true,
          _count: {
            select: {
              members: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      return societyRoles;
    }),
});
