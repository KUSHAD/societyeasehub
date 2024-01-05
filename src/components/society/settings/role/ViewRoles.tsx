"use client";

import { Ghost } from "lucide-react";
import { useParams } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import RoleViewer from "./RoleViewer";

export default function ViewRoles() {
  const { id } = useParams<{ id: string }>();
  const { isLoading, data: roles } = api.role.getBySociety.useQuery(
    {
      societyId: id,
    },
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
    <Skeleton className="my-2 h-12 w-full" count={10} />
  ) : roles && roles.length !== 0 ? (
    roles.map((_role) => <RoleViewer role={_role} key={_role.id} />)
  ) : (
    <div className="flex flex-col items-center gap-2">
      <Ghost className="h-8 w-8 text-zinc-800" />
      <h3 className="text-xl font-semibold">You have not created any roles</h3>
      <p>
        Create a role with different access levels and assign it to users in
        members page
      </p>
    </div>
  );
}
