import type { Role, User } from "@prisma/client";
import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "~/server/api/root";

type RouterOutput = inferRouterOutputs<AppRouter>;

export type SafeUser = Omit<User, "emailVerified">;

export type PartialSafeSociety = {
  id: string;
  name: string;
  _count: {
    members: number;
  };
  ownerId: string;
  owner: {
    name: string | null;
    email: string | null;
  };
};

export type SafeMedia = {
  id: string;
  uri: string;
};

export type SafeRole = Omit<Role, "createdAt" | "updatedAt" | "societyId">;

export type SocietyUsersOutput = RouterOutput["member"]["getBySociety"][0];

export interface PageProps {
  params: {
    id: string;
  };
}
