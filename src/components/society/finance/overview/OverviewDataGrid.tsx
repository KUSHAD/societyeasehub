"use client";

import { useParams, useSearchParams } from "next/navigation";
import { formatDateRange } from "~/lib/utils";
import { api } from "~/trpc/react";
import OverviewDataCard from "./OverviewDataCard";
import { FaPiggyBank } from "react-icons/fa6";

export default function OverviewDataGrid() {
  const searchParams = useSearchParams();

  const to = searchParams.get("to") ?? undefined;
  const from = searchParams.get("from") ?? undefined;

  const { societyId } = useParams<{ societyId: string }>();

  const { data } = api.financeSummary.get.useQuery({
    societyId,
    from: from ?? "",
    accountId: searchParams.get("accountId") ?? "",
    to: to ?? "",
  });

  const dateRangeLabel = formatDateRange({ from, to });

  return (
    <div className="mb-8 grid grid-cols-1 gap-8 pb-2 lg:grid-cols-2">
      <OverviewDataCard
        title="Remaining"
        value={data?.currentPeriod.remaining}
        icon={FaPiggyBank}
        dateRange={dateRangeLabel}
        percentageChange={data?.remainingChange}
        variant="default"
      />
    </div>
  );
}
