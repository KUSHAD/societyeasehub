"use client";

import { Download } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";

export default function ExportTransactionButton() {
  const { societyId } = useParams<{ societyId: string }>();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "";
  const accountId = searchParams.get("accountId") ?? "";
  const to = searchParams.get("to") ?? "";
  return (
    <Link
      target="_blank"
      href={`/api/export/transaction/${societyId}?accountId=${accountId}&from=${from}&to=${to}`}
    >
      <Button className="mx-2" variant="outline">
        <Download className="mx-2" /> Export
      </Button>
    </Link>
  );
}
