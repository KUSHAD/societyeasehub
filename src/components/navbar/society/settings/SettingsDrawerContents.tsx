"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { UserCog, Cog, AlertCircle } from "lucide-react";
import { Button, buttonVariants } from "~/components/ui/button";
import { api } from "~/trpc/react";
export default function SettingsDrawerContents() {
  const { id } = useParams<{ id: string }>();
  const pathname = usePathname();
  const { data: isOwner, isLoading } = api.perms.isOwner.useQuery({
    societyId: id,
  });
  return (
    <>
      <Link
        href={`/society/${id}/settings/general`}
        className={buttonVariants({
          className: "my-2",
          variant:
            pathname === `/society/${id}/settings/general`
              ? "outline"
              : "ghost",
        })}
      >
        <Cog className="mx-2 my-1" />
        General
      </Link>
      <Link
        href={`/society/${id}/settings/role`}
        className={buttonVariants({
          className: "my-2",
          variant:
            pathname === `/society/${id}/settings/role` ? "outline" : "ghost",
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
            href={`/society/${id}/settings/danger`}
            className={buttonVariants({
              className: "my-2",
              variant:
                pathname === `/society/${id}/settings/danger`
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
