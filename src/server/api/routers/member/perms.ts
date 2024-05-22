import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import {
  isSocietyOwner,
  canManageRoadmaps,
  canManageAccounts,
  canAnnounce,
  canAccessSettings,
  canComment,
  canVote,
  canCreatePolls,
  canManageChannels,
} from "~/actions/checkUserRole";

export const permsRouter = createTRPCRouter({
  isOwner: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
      }),
    )
    .query(
      async ({
        input: { societyId },
        ctx: {
          session: { user },
        },
      }) => await isSocietyOwner(societyId, user.id),
    ),
  canManageRoadmaps: protectedProcedure
    .input(z.object({ societyId: z.string().cuid() }))
    .query(
      async ({ input: { societyId } }) => await canManageRoadmaps(societyId),
    ),
  canManageAccounts: protectedProcedure
    .input(z.object({ societyId: z.string().cuid() }))
    .query(
      async ({ input: { societyId } }) => await canManageAccounts(societyId),
    ),
  canAnnounce: protectedProcedure
    .input(z.object({ societyId: z.string().cuid() }))
    .query(async ({ input: { societyId } }) => await canAnnounce(societyId)),
  canAccessSettings: protectedProcedure
    .input(z.object({ societyId: z.string().cuid() }))
    .query(
      async ({ input: { societyId } }) => await canAccessSettings(societyId),
    ),
  canComment: protectedProcedure
    .input(z.object({ societyId: z.string().cuid() }))
    .query(async ({ input: { societyId } }) => await canComment(societyId)),
  canVote: protectedProcedure
    .input(z.object({ societyId: z.string().cuid() }))
    .query(async ({ input: { societyId } }) => await canVote(societyId)),
  canCreatePolls: protectedProcedure
    .input(z.object({ societyId: z.string().cuid() }))
    .query(async ({ input: { societyId } }) => await canCreatePolls(societyId)),
  canManageChannels: protectedProcedure
    .input(z.object({ societyId: z.string().cuid() }))
    .query(
      async ({ input: { societyId } }) => await canManageChannels(societyId),
    ),
});
