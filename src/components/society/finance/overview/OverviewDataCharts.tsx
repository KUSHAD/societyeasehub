"use client";

import { useParams, useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import TransactionChart from "./TransactionChart";
import SpendChart from "./SpendChart";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

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

  if (isLoading)
    return (
      <div className="flex flex-col">
        <div className="my-2">
          <Card className="border-none drop-shadow-sm">
            <CardHeader className="flex justify-between space-y-2 lg:flex-row lg:items-center lg:space-y-0">
              <CardTitle className="line-clamp-1 text-xl">
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[350px] w-full" />
            </CardContent>
          </Card>
          <div className="mb-8 grid grid-cols-1 gap-8 pb-2 lg:grid-cols-2">
            <Card className="border-none drop-shadow-sm">
              <CardHeader className="flex justify-between space-y-2 lg:flex-row lg:items-center lg:space-y-0">
                <CardTitle className="line-clamp-1 text-xl">
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[350px] w-full" />
              </CardContent>
            </Card>
            <Card className="border-none drop-shadow-sm">
              <CardHeader className="flex justify-between space-y-2 lg:flex-row lg:items-center lg:space-y-0">
                <CardTitle className="line-clamp-1 text-xl">Payees</CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[350px] w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col">
      <TransactionChart data={data?.days} />
      <div className="my-2">
        <SpendChart categoryData={data?.categories} payeeData={data?.payees} />
      </div>
    </div>
  );
}
