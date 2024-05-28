"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { UserCog, Cog, AlertCircle } from "lucide-react";
import { Button, buttonVariants } from "~/components/ui/button";
import { api } from "~/trpc/react";
export default function SettingsDrawerContents() {
  const { societyId } = useParams<{ societyId: string }>();
  const pathname = usePathname();
  const { data: isOwner, isLoading } = api.perms.isOwner.useQuery({
    societyId,
  });
  return (
    <>
      <Link
        href={`/society/${societyId}/settings/general`}
        className={buttonVariants({
          className: "my-2",
          variant:
            pathname === `/society/${societyId}/settings/general`
              ? "outline"
              : "ghost",
        })}
      >
        <Cog className="mx-2 my-1" />
        General
      </Link>
      <Link
        href={`/society/${societyId}/settings/role`}
        className={buttonVariants({
          className: "my-2",
          variant:
            pathname === `/society/${societyId}/settings/role`
              ? "outline"
              : "ghost",
        })}
      >
        <UserCog className="mx-2 my-1" />
        Roles
      </Link>
      {isLoading ? (
        <Button variant="destructive" disabled>
          <AlertCircle className="mx-2 my-1" />
          Danger
        </Button>
      ) : (
        isOwner && (
          <Link
            href={`/society/${societyId}/settings/danger`}
            className={buttonVariants({
              className: "my-2",
              variant:
                pathname === `/society/${societyId}/settings/danger`
                  ? "destructive"
                  : "ghost",
            })}
          >
            <AlertCircle className="mx-2 my-1" />
            Danger
          </Link>
        )
      )}
    </>
  );
}
