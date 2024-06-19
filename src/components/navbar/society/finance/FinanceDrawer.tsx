"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { buttonVariants } from "~/components/ui/button";

export default function FinanceDrawer() {
  const { societyId } = useParams<{ societyId: string }>();
  const pathname = usePathname();

  return (
    <>
      <Link
        className={buttonVariants({
          className: "my-2 w-full",
          variant:
            pathname === `/society/${societyId}/finance/overview`
              ? "outline"
              : "ghost",
        })}
        href={`/society/${societyId}/finance/overview`}
      >
        Overview
      </Link>
      <Link
        className={buttonVariants({
          className: "my-2 w-full",
          variant:
            pathname === `/society/${societyId}/finance/transactions`
              ? "outline"
              : "ghost",
        })}
        href={`/society/${societyId}/finance/transactions`}
      >
        Transactions
      </Link>
      <Link
        className={buttonVariants({
          className: "my-2 w-full",
          variant:
            pathname === `/society/${societyId}/finance/accounts`
              ? "outline"
              : "ghost",
        })}
        href={`/society/${societyId}/finance/accounts`}
      >
        Accounts
      </Link>
      <Link
        className={buttonVariants({
          className: "my-2 w-full",
          variant:
            pathname === `/society/${societyId}/finance/categories`
              ? "outline"
              : "ghost",
        })}
        href={`/society/${societyId}/finance/categories`}
      >
        Categories
      </Link>
      <Link
        className={buttonVariants({
          className: "my-2 w-full",
          variant:
            pathname === `/society/${societyId}/finance/payees`
              ? "outline"
              : "ghost",
        })}
        href={`/society/${societyId}/finance/payees`}
      >
        Payees
      </Link>
    </>
  );
}
