import { transactionSchema } from "~/lib/validators/transaction";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { canManageAccounts } from "~/actions/checkUserRole";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const transactionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      transactionSchema.and(
        z.object({
          societyId: z.string().cuid(),
        }),
      ),
    )
    .mutation(
      async ({
        ctx: {
          db,
          session: { user },
        },
        input,
      }) => {
        const canManage = await canManageAccounts(input.societyId);
        if (!canManage) throw new TRPCError({ code: "FORBIDDEN" });

        const transaction = await db.transaction.create({
          data: {
            ...input,
            userId: user.id,
          },
        });

        return transaction;
      },
    ),
});
