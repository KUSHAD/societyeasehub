"use client";

import { useParams } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import RoleViewer from "./RoleViewer";
import NotFound from "~/components/NotFound";

export default function ViewRoles() {
  const { id } = useParams<{ id: string }>();
  const { isLoading, data: roles } = api.role.getBySociety.useQuery(
    {
      societyId: id,
    },
    {
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
    <NotFound
      message="You have not created any roles"
      description="Create a role with different access levels and assign it to users in
        members page"
    />
  );
}
