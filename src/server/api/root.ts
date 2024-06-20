import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { societyRouter } from "./routers/society/society";
import { societyMediaRouter } from "./routers/society/societyMedia";
import { rolesRouter } from "./routers/settings/role";
import { memberRouter } from "./routers/member/member";
import { inviteRouter } from "./routers/member/invite";
import { channelRouter } from "./routers/feed/channel/channel";
import { messageRouter } from "./routers/feed/channel/message";
import { meetingRoomRouter } from "./routers/meetingRoom";
import { roadmapListRouter } from "./routers/roadmap/roadmapList";
import { roadmapCardRouter } from "./routers/roadmap/roadmapCard";
import { announcementRouter } from "./routers/feed/announcement/announcement";
import { announcementCommentRouter } from "./routers/feed/announcement/announcementComment";
import { pollRouter } from "./routers/feed/poll";
import { permsRouter } from "./routers/member/perms";
import { financeAccountsRouter } from "./routers/finance/financeAccount";
import { financeCategoriesRouter } from "./routers/finance/financeCategories";
import { financeTransactionRouter } from "./routers/finance/financeTransaction";
import { financePayeeRouter } from "./routers/finance/financePayee";
import { financeSummaryRouter } from "./routers/finance/financeSummary";

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
  perms: permsRouter,
  invite: inviteRouter,
  channel: channelRouter,
  message: messageRouter,
  meetingRoom: meetingRoomRouter,
  roadmapList: roadmapListRouter,
  roadmapCard: roadmapCardRouter,
  announcement: announcementRouter,
  announcementComment: announcementCommentRouter,
  poll: pollRouter,
  financeAccounts: financeAccountsRouter,
  financeCategories: financeCategoriesRouter,
  financeTransaction: financeTransactionRouter,
  financePayee: financePayeeRouter,
  financeSummary: financeSummaryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
