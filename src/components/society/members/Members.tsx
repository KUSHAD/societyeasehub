"use client";

import { useParams } from "next/navigation";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import Skeleton from "react-loading-skeleton";
import { Ghost } from "lucide-react";
import MemberCard from "./MemberCard";

export default function Members() {
  const { id } = useParams<{ id: string }>();
  const { isLoading, data: members } = api.member.getBySociety.useQuery(
    { societyId: id },
    {
      onError(error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
      retry(failureCount) {
        if (failureCount >= 3) return true;

        return false;
      },

      retryDelay: 500,
    },
  );
  return isLoading ? (
    <Skeleton className="my-2 h-12 w-full scale-95" count={30} />
  ) : members && members.length !== 0 ? (
    members.map((_member) => <MemberCard member={_member} />)
  ) : (
    <div className="flex flex-col items-center gap-2">
      <Ghost className="h-8 w-8 text-zinc-800" />
      <h3 className="text-xl font-semibold">No Members</h3>
    </div>
  );
}
