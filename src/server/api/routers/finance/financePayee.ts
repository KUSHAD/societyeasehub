import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { canManageAccounts } from "~/actions/checkUserRole";
import { TRPCError } from "@trpc/server";
import { financePayeeSchema } from "~/lib/validators/financePayee";

export const financePayeeRouter = createTRPCRouter({
  getBySociety: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
      }),
    )
    .query(async ({ ctx: { db }, input: { societyId } }) => {
      const data = await db.financePayee.findMany({
        where: {
          societyId,
        },
      });

      return data;
    }),
  create: protectedProcedure
    .input(
      financePayeeSchema.merge(
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

      const data = await db.financePayee.create({
        data: {
          ...input,
          societyId: input.societyId,
        },
      });

      return data;
    }),
  update: protectedProcedure
    .input(
      financePayeeSchema.merge(
        z.object({
          societyId: z.string().cuid(),
          payeeId: z.string().cuid(),
        }),
      ),
    )
    .mutation(async ({ ctx: { db }, input }) => {
      const canManage = await canManageAccounts(input.societyId);

      if (!canManage)
        throw new TRPCError({
          code: "FORBIDDEN",
        });

      const data = await db.financePayee.update({
        where: { id: input.payeeId, societyId: input.societyId },
        data: input,
      });

      return data;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
        payeeId: z.array(z.string().cuid()),
      }),
    )
    .mutation(async ({ ctx: { db }, input: { societyId, payeeId } }) => {
      const canManage = await canManageAccounts(societyId);

      if (!canManage)
        throw new TRPCError({
          code: "FORBIDDEN",
        });

      const data = await db.financePayee.deleteMany({
        where: { id: { in: payeeId }, societyId },
      });

      return data;
    }),
  getById: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
        payeeId: z.string().cuid(),
      }),
    )
    .query(async ({ ctx: { db }, input: { societyId, payeeId } }) => {
      const canManage = await canManageAccounts(societyId);

      if (!canManage)
        throw new TRPCError({
          code: "FORBIDDEN",
        });

      const data = await db.financePayee.findUnique({
        where: { id: payeeId, societyId },
      });

      if (!data)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      return data;
    }),
});
