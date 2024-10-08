import type {
  Channel,
  MeetingRoom,
  RoadmapCard,
  RoadmapList,
  Role,
  User,
} from "@prisma/client";
import { type TRPCClientErrorLike } from "@trpc/client";
import {
  type inferTRPCClientTypes,
  type inferRouterOutputs,
} from "@trpc/server";
import { type AppRouter } from "~/server/api/root";

export type RouterOutput = inferRouterOutputs<AppRouter>;
export type BuildProcedure = inferTRPCClientTypes<AppRouter>;

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

export type PollForSociety = RouterOutput["poll"]["getBySociety"][0];

export type AnnouncementsOutput = {
  member: {
    name: string | null;
    image: string | null;
    id: string;
  };
  id: string;
  _count: {
    comments: number;
  };
  content: string;
  attachments: {
    name: string;
    uri: string;
  }[];
  createdAt: Date;
};

export interface PageProps {
  params: {
    societyId: string;
  };
}

export type TRPCClientErrorType = TRPCClientErrorLike<BuildProcedure>;

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

export type DraftMessage = {
  channelId: string;
  content: string;
};

export type DraftMessageAttachment = {
  channelId: string;
  uri: string;
};

export type DraftAnnouncement = {
  societyId: string;
  content: string;
};

export type DraftAnnouncementAttachment = {
  societyId: string;
  uri: string;
};

export type SafeMeeting = Omit<MeetingRoom, "societyId" | "userId"> & {
  status: "UPCOMING" | "ONGOING";
};

export type CardWithList = RoadmapCard & { list: RoadmapList };

export type ListWithCards = RoadmapList & { cards: RoadmapCard[] };

export type RawGroupData = {
  name: string;
  value: number;
};

export type ActiveDaysData = {
  date: Date;
  income: number;
  expense: number;
};

export type FinancialData = {
  income: number;
  expense: number;
  remaining: number;
};

export type Period = {
  from: string | Date | undefined;
  to: string | Date | undefined;
};
