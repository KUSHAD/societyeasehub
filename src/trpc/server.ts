import { headers } from "next/headers";
import { appRouter } from "~/server/api/root";
import { createTRPCContext, t } from "~/server/api/trpc";

const createContext = async () => {
  return createTRPCContext({
    headers: headers(),
  });
};

// Create tRPC client
export const api = t.createCallerFactory(appRouter)(() => createContext());
