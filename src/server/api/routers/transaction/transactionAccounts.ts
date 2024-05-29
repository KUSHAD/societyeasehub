import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const transactionAccountsRouter = createTRPCRouter({
  getBySociety: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
      }),
    )
    .query(async ({ ctx: { db }, input: { societyId } }) => {
      const transactionAccounts = await db.transactionAccount.findMany({
        where: {
          societyId,
        },
        select: {
          id: true,
          name: true,
        },
      });

      return transactionAccounts;
    }),
});
