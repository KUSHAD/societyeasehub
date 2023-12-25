"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { UserCog, Cog, AlertCircle } from "lucide-react";
import { buttonVariants } from "~/components/ui/button";
export default function SettingsDrawerContents() {
  const { id } = useParams<{ id: string }>();
  const pathname = usePathname();
  return (
    <>
      <Link
        href={`/society/${id}/settings/general`}
        className={buttonVariants({
          className: "my-2",
          variant:
            pathname === `/society/${id}/settings/general` ? "outline" : "link",
        })}
      >
        <Cog className="mx-2 my-1" />
        <span className="hidden md:block">General</span>
      </Link>
      <Link
        href={`/society/${id}/settings/role`}
        className={buttonVariants({
          className: "my-2",
          variant:
            pathname === `/society/${id}/settings/role` ? "outline" : "link",
        })}
      >
        <UserCog className="mx-2 my-1" />
        <span className="hidden md:block">Roles</span>
      </Link>
      <Link
        href={`/society/${id}/settings/danger`}
        className={buttonVariants({
          className: "my-2 text-destructive",
          variant:
            pathname === `/society/${id}/settings/danger` ? "outline" : "link",
        })}
      >
        <AlertCircle className="mx-2 my-1" />
        <span className="hidden md:block">Danger</span>
      </Link>
    </>
  );
}
