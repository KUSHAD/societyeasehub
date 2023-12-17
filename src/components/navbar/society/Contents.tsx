"use client";

import { Route, Rss, Settings, Users } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

export default function Contents() {
  const { id } = useParams<{ id: string }>();
  const pathname = usePathname();
  return (
    <>
      <Link
        href={`/society/${id}`}
        className={cn(
          "flex flex-row rounded bg-inherit px-4 py-4 transition-colors ease-in-out ",
          pathname === `/society/${id}`
            ? "border-b-4 border-primary bg-muted"
            : "hover:bg-muted",
        )}
      >
        <Rss className="mx-2" />
        <span className="hidden md:block">Feed</span>
      </Link>
      <Link
        href={`/society/${id}/members`}
        className={cn(
          "flex flex-row rounded bg-inherit px-4 py-4 transition-colors ease-in-out ",
          pathname === `/society/${id}/members`
            ? "border-b-4 border-primary bg-muted"
            : "hover:bg-muted",
        )}
      >
        <Users className="mx-2" />
        <span className="hidden md:block">Members</span>
      </Link>
      <Link
        href={`/society/${id}/roadmap`}
        className={cn(
          "flex flex-row rounded bg-inherit px-4 py-4 transition-colors ease-in-out ",
          pathname === `/society/${id}/roadmap`
            ? "border-b-4 border-primary bg-muted"
            : "hover:bg-muted",
        )}
      >
        <Route className="mx-2" />
        <span className="hidden md:block">Roadmap</span>
      </Link>
      <Link
        href={`/society/${id}/settings`}
        className={cn(
          "flex flex-row rounded bg-inherit px-4 py-4 transition-colors ease-in-out ",
          pathname === `/society/${id}/settings`
            ? "border-b-4 border-primary bg-muted"
            : "hover:bg-muted",
        )}
      >
        <Settings className="mx-2" />
        <span className="hidden md:block">Settings</span>
      </Link>
    </>
  );
}
