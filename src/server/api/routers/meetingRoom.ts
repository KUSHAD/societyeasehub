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
          type: input.type,
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
          type: true,
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
});
