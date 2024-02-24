import type { Channel, Role, User } from "@prisma/client";
import { type TRPCClientErrorLike } from "@trpc/client";
import { type BuildProcedure, type inferRouterOutputs } from "@trpc/server";
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

export type SafeRole = Omit<Role, "societyId">;

export type SocietyUsersOutput = RouterOutput["member"]["getBySociety"][0];

export interface PageProps {
  params: {
    id: string;
  };
}

type TRPCClientErrorTypeParams = "query" | "mutation" | "subscription";

export type TRPCClientErrorType = TRPCClientErrorLike<
  BuildProcedure<TRPCClientErrorTypeParams, never, never>
>;

export type SafeChannel = Omit<Channel, "societyId">;

export type ChannelMember = {
  name: string;
  userId: string;
  societyId: string;
  image: string;
  email: string;
};

export type ChannelMessage = {
  content: string;
  id: string;
  attachments: SafeMedia[];
  member: ChannelMember;
};

export type HomeFeature = {
  title: string;
  description: string;
};
