import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { messageSchema } from "~/lib/validators/message";
import { canSendMessages } from "~/actions/checkUserRole";
import { TRPCError } from "@trpc/server";

export const messageRouter = createTRPCRouter({
  getCountByChannel: protectedProcedure
    .input(z.object({ channelId: z.string().cuid() }))
    .query(async ({ ctx: { db }, input: { channelId } }) => {
      const count = await db.message.count({
        where: {
          channelId,
        },
      });

      return count;
    }),
  getByChannel: protectedProcedure
    .input(z.object({ channelId: z.string().cuid() }))
    .query(async ({ ctx: { db }, input: { channelId } }) => {
      const messages = await db.message.findMany({
        where: {
          channelId,
        },
        select: {
          id: true,
          content: true,
          attachments: { select: { id: true, uri: true } },
          member: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          channel: {
            select: {
              societyId: true,
            },
          },
        },
      });

      const formattedMessages = messages.map((_message) => ({
        content: _message.content,
        id: _message.id,
        attachments: _message.attachments,
        member: {
          name: _message.member.name ?? "Member",
          userId: _message.member.id,
          societyId: _message.channel.societyId,
          image:
            _message.member.image ??
            "https://res.cloudinary.com/dst2pmia1/image/upload/c_crop,h_300,w_300/default_profile_pic.jpg",
        },
      }));

      return formattedMessages;
    }),
  create: protectedProcedure
    .input(
      messageSchema.merge(
        z.object({
          channelId: z.string().cuid(),
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
        input: { channelId, content, societyId },
      }) => {
        const canSend = await canSendMessages(societyId);

        if (!canSend) throw new TRPCError({ code: "FORBIDDEN" });
        const newMessage = await db.message.create({
          data: {
            channelId,
            content,
            userId: id,
          },
        });

        return newMessage;
      },
    ),
});
