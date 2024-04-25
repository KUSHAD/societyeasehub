import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { canManageAccounts } from "~/actions/checkUserRole";
import { TRPCError } from "@trpc/server";

export const transactionDocsRouter = createTRPCRouter({
  getByTransaction: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
        transactionId: z.string().cuid(),
      }),
    )
    .query(async ({ ctx: { db }, input: { societyId, transactionId } }) => {
      const docs = await db.transactionDocs.findMany({
        where: {
          transactionId,
          transaction: {
            societyId,
          },
        },
        select: {
          uri: true,
          id: true,
        },
      });

      return docs;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
        transactionId: z.string().cuid(),
        docId: z.string().cuid(),
      }),
    )
    .mutation(
      async ({ ctx: { db }, input: { docId, societyId, transactionId } }) => {
        const canAccess = await canManageAccounts(societyId);
        if (!canAccess) throw new TRPCError({ code: "FORBIDDEN" });

        const docToDelete = await db.transactionDocs.delete({
          where: {
            id: docId,
            transactionId,
            transaction: {
              societyId,
            },
          },
          select: {
            uri: true,
            id: true,
          },
        });

        return docToDelete;
      },
    ),
});
