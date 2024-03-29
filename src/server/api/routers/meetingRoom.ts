import { createRoomSchema } from "~/lib/validators/createRoom";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { canCreateMeetings } from "~/actions/checkUserRole";
import { TRPCError } from "@trpc/server";
import { toDate } from "date-fns";

export const meetingRoomRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createRoomSchema.and(z.object({ societyId: z.string().cuid() })))
    .mutation(async ({ ctx: { db, session }, input }) => {
      const canCreate = await canCreateMeetings(input.societyId);
      if (!canCreate) throw new TRPCError({ code: "FORBIDDEN" });

      const newRoom = await db.meetingRoom.create({
        data: {
          description: input.description,
          endTime: new Date(input.endTime).toISOString(),
          startTime: new Date(input.startTime).toISOString(),
          societyId: input.societyId,
          title: input.title,
          userId: session.user.id,
        },
      });

      return newRoom;
    }),
  getBySociety: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
      }),
    )
    .query(async ({ ctx: { db }, input: { societyId } }) => {
      const meetings = await db.meetingRoom.findMany({
        where: {
          societyId,
          endTime: {
            gt: new Date().toISOString(),
          },
        },
        select: {
          description: true,
          endTime: true,
          id: true,
          startTime: true,
          title: true,
        },
      });

      return meetings.map((_meeting) => ({
        ..._meeting,
        get status() {
          const currentTime = Date.now();
          if (this.startTime >= toDate(currentTime)) return "UPCOMING";
          return "ONGOING";
        },
      }));
    }),
  getById: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx: { db }, input: { id } }) => {
      const meeting = await db.meetingRoom.findUnique({
        where: { id },
        select: {
          startTime: true,
          endTime: true,
        },
      });

      if (!meeting)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      const currentTime = Date.now();

      if (meeting.startTime >= toDate(currentTime))
        return {
          beforeTime: true,
        };

      if (meeting.endTime <= toDate(currentTime))
        return {
          afterTime: true,
        };

      return {
        ok: true,
      };
    }),
  checkExpiry: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx: { db }, input: { id } }) => {
      const meeting = await db.meetingRoom.findUnique({
        where: { id },
        select: {
          endTime: true,
        },
      });

      if (!meeting)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      const currentTime = Date.now();

      if (meeting.endTime <= toDate(currentTime))
        return {
          expired: true,
        };

      return {
        expired: false,
      };
    }),
});
