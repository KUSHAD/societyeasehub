"use client";

import { Cog } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { buttonVariants } from "~/components/ui/button";

export default function AccountsDrawer() {
  const { id } = useParams<{ id: string }>();
  const pathname = usePathname();

  return (
    <>
      <Link
        className={buttonVariants({
          className: "my-2 w-full",
          variant:
            pathname === `/society/${id}/accounts/overview`
              ? "outline"
              : "ghost",
        })}
        href={`/society/${id}/accounts/overview`}
      >
        Overview
      </Link>
      <Link
        className={buttonVariants({
          className: "my-2 w-full",
          variant:
            pathname === `/society/${id}/accounts/income` ? "outline" : "ghost",
        })}
        href={`/society/${id}/accounts/income`}
      >
        Income
      </Link>
      <Link
        className={buttonVariants({
          className: "my-2 w-full",
          variant:
            pathname === `/society/${id}/accounts/expenditure`
              ? "outline"
              : "ghost",
        })}
        href={`/society/${id}/accounts/expenditure`}
      >
        Expenditure
      </Link>
      <Link
        className={buttonVariants({
          className: "my-2 w-full",
          variant:
            pathname === `/society/${id}/accounts/settings`
              ? "outline"
              : "ghost",
        })}
        href={`/society/${id}/accounts/settings`}
      >
        <Cog className="mx-2 my-1" /> Settings
      </Link>
    </>
  );
}
