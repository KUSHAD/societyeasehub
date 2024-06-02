"use client";

import { Plus } from "lucide-react";
import AccountSheet from "~/components/society/finance/AccountSheet";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useNewAccountSheetStore } from "~/store/finance/newAccountSheet";
import { columns } from "./columns";
import { DataTable } from "~/components/ui/data-table";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";
import { Skeleton } from "~/components/ui/skeleton";
import { toast } from "~/components/ui/use-toast";

export default function Page() {
  const { societyId } = useParams<{ societyId: string }>();
  const newAccountSheetStore = useNewAccountSheetStore();

  const utils = api.useUtils();

  const { data, isLoading } = api.transactionAccounts.getBySociety.useQuery({
    societyId,
  });

  const { mutate: remove, isLoading: deleting } =
    api.transactionAccounts.delete.useMutation({
      async onSuccess() {
        await utils.transactionAccounts.getBySociety.invalidate({
          societyId,
        });

        toast({
          title: "Message",
          description: "Accounts Deleted",
        });
      },
    });

  return (
    <>
      <Card>
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="line-clamp-1 text-xl">Accounts</CardTitle>
          <Button size="sm" onClick={newAccountSheetStore.onOpen}>
            <Plus className="mr-2 size-4" /> Add New
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="my-2 h-[300px] w-full" />
          ) : (
            data && (
              <DataTable
                disabled={deleting}
                filterKey="email"
                columns={columns}
                data={data}
                onDelete={(row) => {
                  const ids = row.map((_row) => _row.original.id);
                  remove({
                    accountId: ids,
                    societyId,
                  });
                }}
              />
            )
          )}
        </CardContent>
      </Card>
      <AccountSheet />
    </>
  );
}
