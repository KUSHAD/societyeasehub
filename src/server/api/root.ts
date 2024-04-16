import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { societyRouter } from "./routers/society/society";
import { societyMediaRouter } from "./routers/society/societyMedia";
import { rolesRouter } from "./routers/settings/role";
import { memberRouter } from "./routers/member/member";
import { inviteRouter } from "./routers/member/invite";
import { channelRouter } from "./routers/feed/channel";
import { messageRouter } from "./routers/feed/message";
import { meetingRoomRouter } from "./routers/meetingRoom";
import { roadmapListRouter } from "./routers/roadmap/roadmapList";
import { roadmapCardRouter } from "./routers/roadmap/roadmapCard";
import { transactionRouter } from "./routers/transaction";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  society: societyRouter,
  societyMedia: societyMediaRouter,
  role: rolesRouter,
  member: memberRouter,
  invite: inviteRouter,
  channel: channelRouter,
  message: messageRouter,
  meetingRoom: meetingRoomRouter,
  roadmapList: roadmapListRouter,
  roadmapCard: roadmapCardRouter,
  transaction: transactionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
