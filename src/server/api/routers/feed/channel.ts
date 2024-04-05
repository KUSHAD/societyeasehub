import { channelSchema } from "~/lib/validators/channel";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { z } from "zod";
import { canManageChannels } from "~/actions/checkUserRole";
import { TRPCError } from "@trpc/server";

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
});
