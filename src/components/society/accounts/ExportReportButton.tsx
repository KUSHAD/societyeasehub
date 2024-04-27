"use client";

import { endOfMonth, startOfMonth } from "date-fns";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { buttonVariants } from "~/components/ui/button";

export default function ExportReportButton() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  return (
    <Link
      href={`/api/report/${id}/export?from=${
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        searchParams.get("from")
          ? new Date(searchParams.get("from")!)
          : startOfMonth(new Date())
      }&to=${
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        searchParams.get("to")
          ? new Date(searchParams.get("to")!)
          : endOfMonth(new Date())
      }`}
      className={buttonVariants({
        variant: "outline",
        className: "mx-2",
      })}
    >
      Export Report
    </Link>
  );
}
