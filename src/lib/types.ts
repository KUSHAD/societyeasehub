import { type User } from "@prisma/client";

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
