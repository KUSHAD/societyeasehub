"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { UserCog, Cog, AlertCircle } from "lucide-react";
import { cn } from "~/lib/utils";
export default function SettingsDrawerContents() {
  const { id } = useParams<{ id: string }>();
  const pathname = usePathname();
  return (
    <>
      <Link
        href={`/society/${id}/settings/general`}
        className={cn(
          "flex flex-row  px-4 py-2 transition ease-in-out",
          pathname === `/society/${id}/settings/general`
            ? "bg-primary/25"
            : "bg-muted hover:underline",
        )}
      >
        <Cog className="mx-2 my-1" /> General
      </Link>
      <Link
        href={`/society/${id}/settings/role`}
        className={cn(
          "flex flex-row  px-4 py-2 transition ease-in-out",
          pathname === `/society/${id}/settings/role`
            ? "bg-primary/25"
            : "bg-muted hover:underline",
        )}
      >
        <UserCog className="mx-2 my-1" />
        Roles
      </Link>
      <Link
        href={`/society/${id}/settings/danger`}
        className={cn(
          "flex flex-row  px-4 py-2 text-destructive transition ease-in-out",
          pathname === `/society/${id}/settings/danger`
            ? "bg-destructive/25"
            : "bg-destructive/10 hover:underline",
        )}
      >
        <AlertCircle className="mx-2 my-1" />
        Danger
      </Link>
    </>
  );
}
