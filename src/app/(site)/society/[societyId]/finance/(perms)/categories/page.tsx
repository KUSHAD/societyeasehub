"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { columns } from "./columns";
import { DataTable } from "~/components/ui/data-table";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";
import { Skeleton } from "~/components/ui/skeleton";
import { toast } from "~/components/ui/use-toast";
import NewCategorySheet from "~/components/society/finance/categories/NewCategorySheet";

export default function Page() {
  const { societyId } = useParams<{ societyId: string }>();

  const utils = api.useUtils();

  const { data, isPending } = api.financeCategories.getBySociety.useQuery({
    societyId,
  });

  const { mutate: remove, isPending: deleting } =
    api.financeCategories.delete.useMutation({
      async onSuccess() {
        await utils.financeCategories.getBySociety.invalidate({
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
          description: "Category Deleted",
        });
      },
    });

  return (
    <Card>
      <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
        <CardTitle className="line-clamp-1 text-xl">Categories</CardTitle>
        <NewCategorySheet />
      </CardHeader>
      <CardContent>
        {isPending ? (
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
                  categoryId: ids,
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
