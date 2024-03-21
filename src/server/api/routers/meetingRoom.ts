import { createRoomSchema } from "~/lib/validators/createRoom";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { canCreateMeetings } from "~/actions/checkUserRole";
import { TRPCError } from "@trpc/server";

export const meetingRoomRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createRoomSchema.and(z.object({ societyId: z.string().cuid() })))
    .mutation(async ({ ctx: { db, session }, input }) => {
      const canCreate = await canCreateMeetings(input.societyId);
      if (!canCreate) throw new TRPCError({ code: "FORBIDDEN" });

      const newRoom = await db.meetingRoom.create({
        data: {
          description: input.description,
          endTime: input.endTime,
          startTime: input.startTime,
          societyId: input.societyId,
          title: input.title,
          type: input.type,
          userId: session.user.id,
        },
      });

      return newRoom;
    }),
});
