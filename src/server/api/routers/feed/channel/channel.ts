import { channelSchema } from "~/lib/validators/channel";
import { createTRPCRouter, protectedProcedure } from "../../../trpc";
import { z } from "zod";
import { canManageChannels } from "~/actions/checkUserRole";
import { TRPCError } from "@trpc/server";
import { utapi } from "~/server/storage";
import { revalidatePath } from "next/cache";

export const channelRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      channelSchema.merge(
        z.object({
          societyId: z.string().cuid(),
        }),
      ),
    )
    .mutation(async ({ ctx: { db }, input: { name, societyId } }) => {
      const canCreate = await canManageChannels(societyId);

      if (!canCreate) throw new TRPCError({ code: "UNAUTHORIZED" });
      const newChannel = await db.channel.create({
        data: {
          name,
          societyId,
        },
      });

      return newChannel;
    }),
  getBySociety: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
      }),
    )
    .query(async ({ ctx: { db }, input: { societyId } }) => {
      const channels = await db.channel.findMany({
        where: {
          societyId,
        },
        select: {
          name: true,
          id: true,
        },
        orderBy: {
          name: "asc",
        },
      });

      return channels;
    }),
  updateName: protectedProcedure
    .input(
      z.object({
        channelId: z.string().cuid(),
        societyId: z.string().cuid(),
        name: z
          .string()
          .min(1, "Required")
          .max(12, "Maximum 12 Characters")
          .trim()
          .toLowerCase()
          .transform((_value) => _value.replace(/\s+/g, "-")),
      }),
    )
    .mutation(async ({ ctx: { db }, input }) => {
      const canCreate = await canManageChannels(input.societyId);

      if (!canCreate) throw new TRPCError({ code: "UNAUTHORIZED" });

      const updatedName = await db.channel.update({
        where: {
          id: input.channelId,
          societyId: input.societyId,
        },
        data: { name: input.name },
      });

      revalidatePath(`/society/${input.societyId}/channel/${input.channelId}`);

      return updatedName;
    }),
  getName: protectedProcedure
    .input(
      z.object({
        channelId: z.string().cuid(),
        societyId: z.string().cuid(),
      }),
    )
    .query(async ({ ctx: { db }, input: { channelId, societyId } }) => {
      const channel = await db.channel.findUnique({
        where: {
          id: channelId,
          societyId,
        },
        select: {
          name: true,
        },
      });

      if (!channel)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      return channel.name;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        channelId: z.string().cuid(),
        societyId: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx: { db }, input }) => {
      const canCreate = await canManageChannels(input.societyId);

      if (!canCreate) throw new TRPCError({ code: "UNAUTHORIZED" });

      const deletedChannel = await db.channel.delete({
        where: {
          id: input.channelId,
          societyId: input.societyId,
        },
        select: {
          messages: {
            select: {
              id: true,
              attachments: {
                select: {
                  uri: true,
                },
              },
            },
          },
        },
      });

      await db.message.deleteMany({
        where: {
          channelId: input.channelId,
        },
      });

      const messageIds = deletedChannel.messages.map((_message) => _message.id);

      const fileKeys = deletedChannel.messages.flatMap((_message) =>
        _message.attachments.map((_media) => _media.uri.split("/f/")[1]!),
      );

      await utapi.deleteFiles(fileKeys);

      await db.messageAttachment.deleteMany({
        where: {
          messageId: {
            in: messageIds,
          },
        },
      });

      return deletedChannel;
    }),
});
