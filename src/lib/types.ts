import { type User } from "@prisma/client";

export type SafeUser = Omit<User, "emailVerified">;

export type PartialSafeSociety = {
  id: string;
  name: string;
  _count: {
    members: number;
  };
  ownerEmail: string;
  owner: {
    name: string | null;
  };
};

export type SafeMedia = {
  id: string;
  uri: string;
};
