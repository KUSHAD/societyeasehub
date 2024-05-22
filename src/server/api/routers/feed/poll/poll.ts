import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { canCreatePolls } from "~/actions/checkUserRole";
import { createPollSchema } from "~/lib/validators/createPoll";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const pollRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      createPollSchema.and(
        z.object({
          societyId: z.string().cuid(),
        }),
      ),
    )
    .mutation(
      async ({
        ctx: {
          db,
          session: {
            user: { id },
          },
        },
        input,
      }) => {
        const canCreate = await canCreatePolls(input.societyId);

        if (!canCreate)
          throw new TRPCError({
            code: "FORBIDDEN",
          });

        const newPoll = db.poll.create({
          data: {
            question: input.question,
            validTill: input.validTill,
            societyId: input.societyId,
            userId: id,
            options: {
              createMany: {
                data: input.options,
                skipDuplicates: true,
              },
            },
          },
        });

        return newPoll;
      },
    ),
  getBySociety: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
      }),
    )
    .query(async ({ ctx: { db }, input: { societyId } }) => {
      const polls = await db.poll.findMany({
        where: {
          societyId,
        },
        select: {
          id: true,
          createdAt: true,
          validTill: true,
          question: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          options: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return polls;
    }),
});
