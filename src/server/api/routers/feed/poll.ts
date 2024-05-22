import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { canCreatePolls, canVote } from "~/actions/checkUserRole";
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
          _count: {
            select: {
              votes: true,
            },
          },
          votes: {
            select: {
              userId: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return polls;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
        pollId: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx: { db }, input: { pollId, societyId } }) => {
      const canCreate = await canCreatePolls(societyId);

      if (!canCreate)
        throw new TRPCError({
          code: "FORBIDDEN",
        });

      const poll = await db.poll.delete({
        where: {
          id: pollId,
          societyId,
        },
      });

      await db.pollOptions.deleteMany({
        where: {
          pollId,
        },
      });

      await db.vote.deleteMany({
        where: {
          pollId,
        },
      });

      return poll;
    }),
  vote: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
        pollId: z.string().cuid(),
        optionId: z.string().cuid(),
      }),
    )
    .mutation(
      async ({
        ctx: {
          db,
          session: { user },
        },
        input: { optionId, pollId, societyId },
      }) => {
        const canVoteInPolls = await canVote(societyId);

        if (!canVoteInPolls)
          throw new TRPCError({
            code: "FORBIDDEN",
          });

        const voteExists = await db.vote.findUnique({
          where: {
            voteId: {
              optionId,
              pollId,
              userId: user.id,
            },
          },
        });

        if (voteExists)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You have  already voted on this poll",
          });

        const vote = await db.vote.create({
          data: {
            optionId,
            pollId,
            userId: user.id,
          },
        });

        return vote;
      },
    ),
});
