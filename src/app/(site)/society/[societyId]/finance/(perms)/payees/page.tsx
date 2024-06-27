"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { DataTable } from "~/components/ui/data-table";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";
import { Skeleton } from "~/components/ui/skeleton";
import { toast } from "~/components/ui/use-toast";
import { columns } from "./columns";
import NewPayeeSheet from "~/components/society/finance/payees/NewPayeeSheet";

export default function Page() {
  const { societyId } = useParams<{ societyId: string }>();

  const utils = api.useUtils();

  const { data, isLoading } = api.financePayee.getBySociety.useQuery({
    societyId,
  });

  const { mutate: remove, isLoading: deleting } =
    api.financePayee.delete.useMutation({
      async onSuccess() {
        await utils.financePayee.getBySociety.invalidate({
          societyId,
        });

        await utils.financeTransaction.getBySocietyAndAccounts.invalidate({
          societyId,
        });

        await utils.financeSummary.get.invalidate({
          societyId,
        });

        toast({
          title: "Message",
          description: "Payee Deleted",
        });
      },
    });

  return (
    <Card>
      <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
        <CardTitle className="line-clamp-1 text-xl">Payees</CardTitle>
        <NewPayeeSheet />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="my-2 h-[300px] w-full" />
        ) : (
          data && (
            <DataTable
              disabled={deleting}
              filterKey="name"
              columns={columns}
              data={data}
              onDelete={(row) => {
                const ids = row.map((_row) => _row.original.id);
                remove({
                  payeeId: ids,
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
