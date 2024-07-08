"use client";

import { useParams } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import { api } from "~/trpc/react";

export default function SocietyRoleCheckBox() {
  const { societyId } = useParams<{ societyId: string }>();
  const { data: roles, isPending: getting } = api.role.getBySociety.useQuery({
    societyId,
  });
  return getting ? (
    <Skeleton className="my-2 h-10 w-full" count={5} />
  ) : (
    JSON.stringify(roles)
  );
}
