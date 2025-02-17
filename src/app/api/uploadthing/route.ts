import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "~/server/storage";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
