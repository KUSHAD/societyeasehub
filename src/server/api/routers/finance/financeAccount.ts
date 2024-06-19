import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { canManageAccounts } from "~/actions/checkUserRole";
import { TRPCError } from "@trpc/server";

export const financeAccountsRouter = createTRPCRouter({
  getBySociety: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
      }),
    )
    .query(async ({ ctx: { db }, input: { societyId } }) => {
      const financeAccounts = await db.financeAccount.findMany({
        where: {
          societyId,
        },
        select: {
          id: true,
          name: true,
        },
      });

      return financeAccounts;
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

      const data = await db.financeAccount.create({
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
        accountId: z.string().cuid(),
      }),
    )
    .mutation(
      async ({ ctx: { db }, input: { name, societyId, accountId } }) => {
        const canManage = await canManageAccounts(societyId);

        if (!canManage)
          throw new TRPCError({
            code: "FORBIDDEN",
          });

        const data = await db.financeAccount.update({
          where: { id: accountId, societyId },
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
        accountId: z.array(z.string().cuid()),
      }),
    )
    .mutation(async ({ ctx: { db }, input: { societyId, accountId } }) => {
      const canManage = await canManageAccounts(societyId);

      if (!canManage)
        throw new TRPCError({
          code: "FORBIDDEN",
        });

      const data = await db.financeAccount.deleteMany({
        where: { id: { in: accountId }, societyId },
      });

      return data;
    }),
  getById: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
        accountId: z.string().cuid(),
      }),
    )
    .query(async ({ ctx: { db }, input: { societyId, accountId } }) => {
      const canManage = await canManageAccounts(societyId);

      if (!canManage)
        throw new TRPCError({
          code: "FORBIDDEN",
        });

      const data = await db.financeAccount.findUnique({
        where: { id: accountId, societyId },
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
