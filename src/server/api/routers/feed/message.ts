import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { messageSchema } from "~/lib/validators/message";
import { canManageChannels, canSendMessages } from "~/actions/checkUserRole";
import { TRPCError } from "@trpc/server";
import { utapi } from "~/server/storage";

export const messageRouter = createTRPCRouter({
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
              email: true,
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
          email: _message.member.email!,
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
          attachments: z.array(z.string().url()).default([]),
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
        input: { channelId, content, societyId, attachments },
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

        if (attachments.length !== 0) {
          await db.messageAttachment.createMany({
            data: attachments.map((_uri) => ({
              uri: _uri,
              messageId: newMessage.id,
            })),
            skipDuplicates: true,
          });
        }

        return newMessage;
      },
    ),
  userDelete: protectedProcedure
    .input(
      z.object({
        messageId: z.string().cuid(),
      }),
    )
    .mutation(
      async ({
        ctx: {
          db,
          session: { user },
        },
        input: { messageId },
      }) => {
        const deletedMessage = await db.message.delete({
          where: {
            id: messageId,
            userId: user.id,
          },
          select: {
            attachments: {
              select: {
                uri: true,
              },
            },
          },
        });

        const fileKeys = deletedMessage.attachments.map(
          (_media) => _media.uri.split("/f/")[1]!,
        );

        await utapi.deleteFiles(fileKeys);

        await db.messageAttachment.deleteMany({
          where: { messageId },
        });

        return deletedMessage;
      },
    ),
  adminDelete: protectedProcedure
    .input(
      z.object({
        messageId: z.string().cuid(),
        societyId: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx: { db }, input: { messageId, societyId } }) => {
      const canManage = await canManageChannels(societyId);

      if (!canManage) throw new TRPCError({ code: "FORBIDDEN" });

      const deletedMessage = await db.message.delete({
        where: {
          id: messageId,
        },
        select: {
          attachments: {
            select: {
              uri: true,
            },
          },
        },
      });

      const fileKeys = deletedMessage.attachments.map(
        (_media) => _media.uri.split("/f/")[1]!,
      );

      await utapi.deleteFiles(fileKeys);

      await db.messageAttachment.deleteMany({
        where: { messageId },
      });

      return deletedMessage;
    }),
});
