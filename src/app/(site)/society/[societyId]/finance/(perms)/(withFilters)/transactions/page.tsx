"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { DataTable } from "~/components/ui/data-table";
import { api } from "~/trpc/react";
import { useParams, useSearchParams } from "next/navigation";
import { Skeleton } from "~/components/ui/skeleton";
import { toast } from "~/components/ui/use-toast";
import { columns } from "./columns";
import NewTransactionSheet from "~/components/society/finance/transactions/NewTransactionSheet";
import ExportTransactionButton from "~/components/society/finance/transactions/ExportTransactionButton";
import { Button } from "~/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { env } from "~/env";

export default function Page() {
  const { societyId } = useParams<{ societyId: string }>();

  const utils = api.useUtils();

  const searchParams = useSearchParams();

  const { data, isPending } =
    api.financeTransaction.getBySocietyAndAccounts.useQuery({
      societyId,
      from: searchParams.get("from") ?? "",
      accountId: searchParams.get("accountId") ?? "",
      to: searchParams.get("to") ?? "",
    });

  const { mutate: remove, isPending: deleting } =
    api.financeTransaction.delete.useMutation({
      async onSuccess() {
        await utils.financeTransaction.getBySocietyAndAccounts.invalidate({
          societyId,
        });

        toast({
          title: "Message",
          description: "Transactions Deleted",
        });
      },
    });

  const { isPending: seeding, mutate: seed } =
    api.financeTransaction.seed.useMutation({
      async onSuccess() {
        await utils.financeTransaction.getBySocietyAndAccounts.invalidate({
          societyId,
        });

        await utils.financeSummary.get.invalidate({
          societyId,
        });

        toast({
          title: "Message",
          description: "Transactions Seeded",
        });
      },
    });

  return (
    <Card>
      <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
        <CardTitle className="line-clamp-1 text-xl">Transactions</CardTitle>
        <div className="flex flex-row justify-between">
          {env.NEXT_PUBLIC_ABSOLUTE_URL.includes("http://localhost:3000") && (
            <Button
              disabled={seeding}
              onClick={() => seed({ societyId })}
              className="mx-2"
            >
              <RefreshCcw className="mx-2" /> Seed Transactions
            </Button>
          )}
          <ExportTransactionButton />
          <NewTransactionSheet />
        </div>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <Skeleton className="my-2 h-[300px] w-full" />
        ) : (
          data && (
            <DataTable
              disabled={deleting}
              filterKey="payee"
              columns={columns}
              data={data}
              onDelete={(row) => {
                const ids = row.map((_row) => _row.original.id);
                remove({
                  transactionId: ids,
                  societyId,
                });
              }}
            />
          )
        )}
      </CardContent>
    </Card>
  );
}
