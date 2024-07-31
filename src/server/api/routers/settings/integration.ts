import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { isSocietyOwner } from "~/actions/checkUserRole";
import { TRPCError } from "@trpc/server";
import generateApiKey from "generate-api-key";
import { integrationSchema } from "~/lib/validators/integration";

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
        },
      });

      return data;
    }),
  getSocietyPerms: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
      }),
    )
    .query(async ({ ctx: { db, session }, input: { societyId } }) => {
      const isOwner = await isSocietyOwner(societyId, session.user.id);

      if (!isOwner) throw new TRPCError({ code: "FORBIDDEN" });

      const data = await db.society.findUnique({
        where: {
          id: societyId,
        },
        select: {
          integrateAnnouncements: true,
          integrateRoadmaps: true,
          integrateTransactions: true,
        },
      });

      if (!data) throw new TRPCError({ code: "NOT_FOUND" });

      return data;
    }),
  updateSocietyPerms: protectedProcedure
    .input(
      integrationSchema.merge(
        z.object({
          societyId: z.string().cuid(),
        }),
      ),
    )
    .mutation(
      async ({
        ctx: { db, session },
        input: {
          societyId,
          integrateAnnouncements,
          integrateRoadmaps,
          integrateTransactions,
        },
      }) => {
        const isOwner = await isSocietyOwner(societyId, session.user.id);

        if (!isOwner) throw new TRPCError({ code: "FORBIDDEN" });

        const data = await db.society.update({
          where: {
            id: societyId,
          },
          data: {
            integrateAnnouncements,
            integrateRoadmaps,
            integrateTransactions,
          },
          select: {
            integrateAnnouncements: true,
            integrateRoadmaps: true,
            integrateTransactions: true,
          },
        });

        return data;
      },
    ),
  revokeAPIKey: protectedProcedure
    .input(
      z.object({
        apiKey: z.string(),
        societyId: z.string().cuid(),
      }),
    )
    .mutation(
      async ({ ctx: { db, session }, input: { societyId, apiKey } }) => {
        const isOwner = await isSocietyOwner(societyId, session.user.id);

        if (!isOwner) throw new TRPCError({ code: "FORBIDDEN" });

        const data = await db.integrationAPIKey.delete({
          where: {
            societyId,
            key: apiKey,
          },
          select: {
            key: true,
          },
        });

        return data;
      },
    ),
});
