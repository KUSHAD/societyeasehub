import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { canAnnounce, canComment } from "~/actions/checkUserRole";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const announcementCommentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
        announcementId: z.string().cuid(),
        content: z.string().min(1, "Required").max(50, "Max 50 Characters"),
      }),
    )
    .mutation(
      async ({
        ctx: {
          db,
          session: { user },
        },
        input,
      }) => {
        const canCreate = await canComment(input.societyId);
        if (!canCreate) throw new TRPCError({ code: "FORBIDDEN" });

        const newComment = await db.announcementComment.create({
          data: {
            content: input.content,
            announcementId: input.announcementId,
            userId: user.id,
          },
        });

        return newComment;
      },
    ),
  getByAnnouncement: protectedProcedure
    .input(
      z.object({
        announcementId: z.string().cuid(),
      }),
    )
    .query(async ({ ctx: { db }, input: { announcementId } }) => {
      const comments = await db.announcementComment.findMany({
        where: {
          announcementId,
        },
        select: {
          id: true,
          user: {
            select: {
              id: true,
              image: true,
              name: true,
            },
          },
          content: true,
        },
      });

      return comments;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
        announcementId: z.string().cuid(),
        commentId: z.string().cuid(),
      }),
    )
    .mutation(
      async ({
        ctx: {
          db,
          session: { user },
        },
        input: { announcementId, commentId, societyId },
      }) => {
        const canCreate = await canComment(societyId);
        const canAnnouncePerms = await canAnnounce(societyId);

        const whereClause1 = {
          id: commentId,
          announcementId,
          announcement: {
            societyId,
          },
        };
        const whereClause2 = {
          id: commentId,
          announcementId,
          announcement: {
            societyId,
          },
          userId: user.id,
        };

        if (!canCreate && !canAnnouncePerms) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const deletedComment = await db.announcementComment.delete({
          where: canAnnouncePerms ? whereClause1 : whereClause2,
        });

        return deletedComment;
      },
    ),
});
