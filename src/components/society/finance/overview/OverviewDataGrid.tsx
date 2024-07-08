"use client";

import { useParams, useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import OverviewDataCard, { OverviewDataCardLoading } from "./OverviewDataCard";
import { FaArrowTrendDown, FaArrowTrendUp, FaPiggyBank } from "react-icons/fa6";

export default function OverviewDataGrid() {
  const searchParams = useSearchParams();

  const to = searchParams.get("to") ?? undefined;
  const from = searchParams.get("from") ?? undefined;

  const { societyId } = useParams<{ societyId: string }>();

  const { data, isPending } = api.financeSummary.get.useQuery({
    societyId,
    from: from ?? "",
    accountId: searchParams.get("accountId") ?? "",
    to: to ?? "",
  });

  if (isPending)
    return (
      <div className="mb-8 grid grid-cols-1 gap-8 pb-2 lg:grid-cols-3">
        <OverviewDataCardLoading />
        <OverviewDataCardLoading />
        <OverviewDataCardLoading />
      </div>
    );

  return (
    <div className="mb-8 grid grid-cols-1 gap-8 pb-2 lg:grid-cols-3">
      <OverviewDataCard
        title="Net Balance"
        value={data?.currentPeriod.remaining}
        icon={FaPiggyBank}
        percentageChange={data?.remainingChange}
        variant="default"
      />
      <OverviewDataCard
        title="Income"
        value={data?.currentPeriod.income}
        icon={FaArrowTrendUp}
        percentageChange={data?.incomeChange}
        variant="success"
      />
      <OverviewDataCard
        title="Expenses"
        value={data?.currentPeriod.expense}
        icon={FaArrowTrendDown}
        percentageChange={data?.expenseChange}
        variant="danger"
      />
    </div>
  );
}
