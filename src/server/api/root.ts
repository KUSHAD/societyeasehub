import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { societyRouter } from "./routers/society";
import { societyMediaRouter } from "./routers/societyMedia";
import { rolesRouter } from "./routers/role";

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
});

// export type definition of API
export type AppRouter = typeof appRouter;
