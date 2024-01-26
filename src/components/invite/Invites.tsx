"use client";

import { api } from "~/trpc/react";
import Skeleton from "react-loading-skeleton";
import NotFound from "../NotFound";
import InviteCard from "./InviteCard";

export default function Invites() {
  const { data: pendingInvites, isLoading } =
    api.invite.getUserPending.useQuery(undefined);
  return isLoading ? (
    <Skeleton className="my-2 h-[75px] w-full" count={10} />
  ) : pendingInvites && pendingInvites.length !== 0 ? (
    pendingInvites.map((_invite) => (
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      <InviteCard invite={_invite} key={_invite.society.id} />
    ))
  ) : (
    <NotFound message="You have no invites" />
  );
}
