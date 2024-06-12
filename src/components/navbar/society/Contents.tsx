"use client";

import { Coins, Route, Rss, Settings, Users, Video } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export default function Contents() {
  const { societyId } = useParams<{ societyId: string }>();
  const pathname = usePathname();

  const { data: accessSettings, isLoading: settingsLoading } =
    api.perms.canAccessSettings.useQuery({
      societyId,
    });

  const { data: accessFinance, isLoading: financeLoading } =
    api.perms.canManageAccounts.useQuery({
      societyId,
    });

  return (
    <>
      <Link
        href={`/society/${societyId}/feed`}
        className={cn(
          "flex flex-row rounded bg-inherit px-4 py-4 transition-colors ease-in-out ",
          pathname.includes(`/society/${societyId}/feed`)
            ? "border-b-4 border-primary bg-muted"
            : "hover:bg-muted",
        )}
      >
        <Rss className="mx-2" />
        <span className="hidden md:block">Feed</span>
      </Link>

      {financeLoading ? (
        <div className="flex flex-row rounded bg-inherit px-4 py-4 opacity-50 transition-colors ease-in-out ">
          <Coins className="mx-2" />
          <span className="hidden md:block">Finance</span>
        </div>
      ) : accessFinance ? (
        <Link
          href={`/society/${societyId}/finance/overview`}
          className={cn(
            "flex flex-row rounded bg-inherit px-4 py-4 transition-colors ease-in-out ",
            pathname.includes(`/society/${societyId}/finance`)
              ? "border-b-4 border-primary bg-muted"
              : "hover:bg-muted",
          )}
        >
          <Coins className="mx-2" />
          <span className="hidden md:block">Finance</span>
        </Link>
      ) : (
        <Link
          href={`/society/${societyId}/finance`}
          className={cn(
            "flex flex-row rounded bg-inherit px-4 py-4 transition-colors ease-in-out ",
            pathname.includes(`/society/${societyId}/finance`)
              ? "border-b-4 border-primary bg-muted"
              : "hover:bg-muted",
          )}
        >
          <Coins className="mx-2" />
          <span className="hidden md:block">Finance</span>
        </Link>
      )}

      <Link
        href={`/society/${societyId}/roadmap`}
        className={cn(
          "flex flex-row rounded bg-inherit px-4 py-4 transition-colors ease-in-out ",
          pathname === `/society/${societyId}/roadmap`
            ? "border-b-4 border-primary bg-muted"
            : "hover:bg-muted",
        )}
      >
        <Route className="mx-2" />
        <span className="hidden md:block">Roadmap</span>
      </Link>
      <Link
        href={`/society/${societyId}/meeting`}
        className={cn(
          "flex flex-row rounded bg-inherit px-4 py-4 transition-colors ease-in-out ",
          pathname.includes(`/society/${societyId}/meeting`)
            ? "border-b-4 border-primary bg-muted"
            : "hover:bg-muted",
        )}
      >
        <Video className="mx-2" />
        <span className="hidden md:block">Meetings</span>
      </Link>
      <Link
        href={`/society/${societyId}/members`}
        className={cn(
          "flex flex-row rounded bg-inherit px-4 py-4 transition-colors ease-in-out ",
          pathname === `/society/${societyId}/members`
            ? "border-b-4 border-primary bg-muted"
            : "hover:bg-muted",
        )}
      >
        <Users className="mx-2" />
        <span className="hidden md:block">Members</span>
      </Link>
      {settingsLoading ? (
        <div className="flex flex-row rounded bg-inherit px-4 py-4 opacity-50 transition-colors ease-in-out ">
          <Settings className="mx-2" />
          <span className="hidden md:block">Settings</span>
        </div>
      ) : (
        <Link
          href={
            accessSettings
              ? `/society/${societyId}/settings/general`
              : `/society/${societyId}/settings`
          }
          className={cn(
            "flex flex-row rounded bg-inherit px-4 py-4 transition-colors ease-in-out ",
            pathname.includes(`/society/${societyId}/settings`)
              ? "border-b-4 border-primary bg-muted"
              : "hover:bg-muted",
          )}
        >
          <Settings className="mx-2" />
          <span className="hidden md:block">Settings</span>
        </Link>
      )}
    </>
  );
}
