"use client";

import { useParams, useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import OverviewChart from "./OverviewChart";

export default function OverviewDataCharts() {
  const searchParams = useSearchParams();

  const to = searchParams.get("to") ?? undefined;
  const from = searchParams.get("from") ?? undefined;

  const { societyId } = useParams<{ societyId: string }>();

  const { data, isLoading } = api.financeSummary.get.useQuery({
    societyId,
    from: from ?? "",
    accountId: searchParams.get("accountId") ?? "",
    to: to ?? "",
  });

  if (isLoading) return "loading";

  return <OverviewChart data={data?.days} />;
}
