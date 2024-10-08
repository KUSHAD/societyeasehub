import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc";
import { canManageAccounts } from "~/actions/checkUserRole";
import { TRPCError } from "@trpc/server";
import { financeTransactionSchema } from "~/lib/validators/financeTransaction";
import { parse, subDays } from "date-fns";
import { seed } from "~/scripts/seed";
import { env } from "~/env";

export const financeTransactionRouter = createTRPCRouter({
  getBySocietyAndAccounts: protectedProcedure
    .input(
      z
        .object({
          societyId: z.string().cuid(),
          from: z.string().optional(),
          to: z.string().optional(),
          accountId: z.string().cuid(),
        })
        .or(
          z.object({
            societyId: z.string().cuid(),
            from: z.string().optional(),
            to: z.string().optional(),
            accountId: z.string(),
          }),
        ),
    )
    .query(async ({ ctx: { db }, input }) => {
      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);

      const startDate = input.from
        ? parse(input.from, "yyyy-MM-dd", new Date())
        : defaultFrom;

      const endDate = input.to
        ? parse(input.to, "yyyy-MM-dd", new Date())
        : defaultTo;

      const data = await db.financeTransaction.findMany({
        where: {
          accountId: input.accountId || undefined,
          societyId: input.societyId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          account: true,
          category: true,
          payee: true,
        },
        orderBy: {
          date: "desc",
        },
      });

      return data;
    }),
  create: protectedProcedure
    .input(
      financeTransactionSchema.merge(
        z.object({
          societyId: z.string().cuid(),
        }),
      ),
    )
    .mutation(async ({ ctx: { db }, input }) => {
      const canManage = await canManageAccounts(input.societyId);

      if (!canManage)
        throw new TRPCError({
          code: "FORBIDDEN",
        });

      const data = await db.financeTransaction.create({ data: input });

      return data;
    }),
  update: protectedProcedure
    .input(
      financeTransactionSchema.merge(
        z.object({
          societyId: z.string().cuid(),
          transactionId: z.string().cuid(),
        }),
      ),
    )
    .mutation(async ({ ctx: { db }, input }) => {
      const canManage = await canManageAccounts(input.societyId);

      const newInput = {
        ...input,
        transactionId: undefined,
      };

      if (!canManage)
        throw new TRPCError({
          code: "FORBIDDEN",
        });

      const data = await db.financeTransaction.update({
        where: { id: input.transactionId, societyId: input.societyId },
        data: newInput,
      });

      return data;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
        transactionId: z.array(z.string().cuid()),
      }),
    )
    .mutation(async ({ ctx: { db }, input: { societyId, transactionId } }) => {
      const canManage = await canManageAccounts(societyId);

      if (!canManage)
        throw new TRPCError({
          code: "FORBIDDEN",
        });

      const data = await db.financeTransaction.deleteMany({
        where: { id: { in: transactionId }, societyId },
      });

      return data;
    }),
  getById: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
        transactionId: z.string().cuid(),
      }),
    )
    .query(async ({ ctx: { db }, input }) => {
      const canManage = await canManageAccounts(input.societyId);

      if (!canManage)
        throw new TRPCError({
          code: "FORBIDDEN",
        });

      const data = await db.financeTransaction.findUnique({
        where: {
          id: input.transactionId,
          societyId: input.societyId,
        },
      });

      if (!data) throw new TRPCError({ code: "NOT_FOUND" });

      return data;
    }),
  seed: publicProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
      }),
    )
    .mutation(async ({ input }) => {
      if (env.NODE_ENV !== "development")
        throw new TRPCError({ code: "FORBIDDEN" });

      await seed(input.societyId);
    }),
});
