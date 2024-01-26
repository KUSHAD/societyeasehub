"use client";

import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import Skeleton from "react-loading-skeleton";
import MemberCard from "./MemberCard";
import NotFound from "~/components/NotFound";

export interface MembersProps {
  canKick: boolean;
  canAssignRoles: boolean;
}

export default function Members({ canAssignRoles, canKick }: MembersProps) {
  const { id } = useParams<{ id: string }>();
  const { isLoading, data: members } = api.member.getBySociety.useQuery({
    societyId: id,
  });

  return isLoading ? (
    <Skeleton className="my-2 h-12 w-full scale-95" count={30} />
  ) : members && members.length !== 0 ? (
    members.map((_member) => (
      <MemberCard
        member={_member}
        canAssignRoles={canAssignRoles}
        canKick={canKick}
        key={_member.user.image}
      />
    ))
  ) : (
    <NotFound message="No Members" />
  );
}
