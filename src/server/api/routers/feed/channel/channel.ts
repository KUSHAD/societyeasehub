import { channelSchema } from "~/lib/validators/channel";
import { createTRPCRouter, protectedProcedure } from "../../../trpc";
import { z } from "zod";
import { canManageChannels } from "~/actions/checkUserRole";
import { TRPCError } from "@trpc/server";
import { utapi } from "~/server/storage";
import { revalidatePath } from "next/cache";
import { type SafeChannel } from "~/lib/types";

export const channelRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      channelSchema.merge(
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
        input: { name, societyId },
      }) => {
        const canCreate = await canManageChannels(societyId);

        if (!canCreate) throw new TRPCError({ code: "UNAUTHORIZED" });
        const newChannel = await db.channel.create({
          data: {
            name,
            societyId,
            creatorId: user.id,
          },
        });

        return newChannel;
      },
    ),
  getBySociety: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
      }),
    )
    .query(async ({ ctx: { db, session }, input: { societyId } }) => {
      const userId = session.user.id;

      // Get the user's role in the society
      const userMember = await db.member.findUnique({
        where: {
          id: {
            userId,
            societyId,
          },
        },
        select: {
          roleId: true,
        },
      });

      if (!userMember)
        throw new TRPCError({
          message: "User is not a member of this society",
          code: "NOT_FOUND",
        });

      const { roleId } = userMember;

      // Check if the user is the owner of the society
      const isOwner = await db.society.findFirst({
        where: {
          id: societyId,
          ownerId: userId,
        },
      });

      // Define the channels query
      let channelsQuery: unknown;

      if (isOwner) {
        // Owner can see all channels
        channelsQuery = db.channel.findMany({
          where: {
            societyId,
          },
          select: {
            name: true,
            id: true,
            creatorId: true,
          },
          orderBy: {
            name: "asc",
          },
        });
      } else {
        // Check if the user is a channel creator or has access based on roles
        channelsQuery = db.channel.findMany({
          where: {
            societyId,
            OR: [
              { creatorId: userId },
              {
                accessedRoles: {
                  some: {
                    roleId: roleId ?? undefined,
                  },
                },
              },
            ],
          },
          select: {
            name: true,
            id: true,
            creatorId: true,
          },
          orderBy: {
            name: "asc",
          },
        });
      }

      const channels = await channelsQuery;

      return channels as SafeChannel[];
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
