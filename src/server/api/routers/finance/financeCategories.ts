import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { canManageAccounts } from "~/actions/checkUserRole";
import { TRPCError } from "@trpc/server";

export const financeCategoriesRouter = createTRPCRouter({
  getBySociety: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
      }),
    )
    .query(async ({ ctx: { db }, input: { societyId } }) => {
      const financeCategories = await db.financeCategory.findMany({
        where: {
          societyId,
        },
        select: {
          id: true,
          name: true,
        },
      });

      return financeCategories;
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Required").max(100, "Max 100 Characters"),
        societyId: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx: { db }, input: { name, societyId } }) => {
      const canManage = await canManageAccounts(societyId);

      if (!canManage)
        throw new TRPCError({
          code: "FORBIDDEN",
        });

      const data = await db.financeCategory.create({
        data: {
          name,
          societyId,
        },
      });

      return data;
    }),
  update: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Required").max(100, "Max 100 Characters"),
        societyId: z.string().cuid(),
        categoryId: z.string().cuid(),
      }),
    )
    .mutation(
      async ({ ctx: { db }, input: { name, societyId, categoryId } }) => {
        const canManage = await canManageAccounts(societyId);

        if (!canManage)
          throw new TRPCError({
            code: "FORBIDDEN",
          });

        const data = await db.financeCategory.update({
          where: { id: categoryId, societyId },
          data: {
            name,
          },
        });

        return data;
      },
    ),
  delete: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
        categoryId: z.array(z.string().cuid()),
      }),
    )
    .mutation(async ({ ctx: { db }, input: { societyId, categoryId } }) => {
      const canManage = await canManageAccounts(societyId);

      if (!canManage)
        throw new TRPCError({
          code: "FORBIDDEN",
        });

      const data = await db.financeCategory.deleteMany({
        where: { id: { in: categoryId }, societyId },
      });

      return data;
    }),
  getById: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
        categoryId: z.string().cuid(),
      }),
    )
    .query(async ({ ctx: { db }, input: { societyId, categoryId } }) => {
      const canManage = await canManageAccounts(societyId);

      if (!canManage)
        throw new TRPCError({
          code: "FORBIDDEN",
        });

      const data = await db.financeCategory.findUnique({
        where: { id: categoryId, societyId },
        select: {
          name: true,
        },
      });

      if (!data)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      return data.name;
    }),
});
