import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { isSocietyOwner } from "~/actions/checkUserRole";
import { TRPCError } from "@trpc/server";
import generateApiKey from "generate-api-key";

export const integrationsRouter = createTRPCRouter({
  createAPIKey: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx: { db, session }, input: { societyId } }) => {
      const isOwner = await isSocietyOwner(societyId, session.user.id);

      if (!isOwner) throw new TRPCError({ code: "FORBIDDEN" });

      const newKey = generateApiKey({
        method: "base62",
        prefix: societyId,
      }) as string;

      const data = await db.integrationAPIKey.create({
        data: {
          key: newKey,
          societyId,
        },
        select: {
          key: true,
          id: true,
        },
      });

      return data;
    }),
  getAPIKeys: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
      }),
    )
    .query(async ({ ctx: { db, session }, input: { societyId } }) => {
      const isOwner = await isSocietyOwner(societyId, session.user.id);

      if (!isOwner) throw new TRPCError({ code: "FORBIDDEN" });

      const data = await db.integrationAPIKey.findMany({
        where: {
          societyId,
        },
        select: {
          key: true,
          id: true,
        },
      });

      return data;
    }),
});
