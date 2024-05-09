import { announcementSchema } from "~/lib/validators/announcement";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { z } from "zod";
import { canAnnounce } from "~/actions/checkUserRole";
import { TRPCError } from "@trpc/server";

export const announcementRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      announcementSchema.merge(
        z.object({
          societyId: z.string().cuid(),
          attachments: z.array(z.string().url()).default([]),
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
        const canAccess = await canAnnounce(input.societyId);

        if (!canAccess) throw new TRPCError({ code: "FORBIDDEN" });

        const newAnnouncement = await db.announcement.create({
          data: {
            societyId: input.societyId,
            content: input.content,
            userId: user.id,
          },
        });

        if (input.attachments.length !== 0) {
          await db.announcementAttachments.createMany({
            data: input.attachments.map((_uri) => ({
              uri: _uri,
              announcementId: newAnnouncement.id,
              name: _uri.split("/f/")[1]!,
            })),
            skipDuplicates: true,
          });
        }

        return newAnnouncement;
      },
    ),
});
