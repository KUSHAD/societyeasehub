"use client";

import { EnvelopeOpenIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { badgeVariants } from "~/components/ui/badge";
import { toast } from "~/components/ui/use-toast";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

interface InviteNavIconProps {
  className?: string;
}

export default function InviteNavIcon({ className }: InviteNavIconProps) {
  const { data: pendingCount } = api.invite.getPendingCount.useQuery(
    undefined,
    {
      retry(failureCount) {
        if (failureCount >= 3) return true;

        return false;
      },

      retryDelay: 500,
    },
  );
  const pathname = usePathname();
  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "mx-4 my-4",
          pathname === "/invite" ? "opacity-100" : "opacity-20",
        )}
      >
        <Link href="/invite">
          <EnvelopeOpenIcon className="h-[24px] w-[24px]" />
        </Link>
      </div>
      {pendingCount && pendingCount !== 0 ? (
        <Link
          href="/invite"
          className={badgeVariants({
            variant: "destructive",
            className: "absolute right-0 top-0 block",
          })}
        >
          {pendingCount}
        </Link>
      ) : null}
    </div>
  );
}
