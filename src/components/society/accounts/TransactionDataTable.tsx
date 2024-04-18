"use client";

import { useParams, useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import { startOfMonth, endOfMonth } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import NotFound from "~/components/NotFound";
import { type RouterOutput } from "~/lib/types";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "~/components/ui/data-table";
import { DataTableColumnHeader } from "~/components/ui/data-table/column-header";
import { Checkbox } from "~/components/ui/checkbox";

type Transaction = RouterOutput["transaction"]["getTableData"][0];

const columns: ColumnDef<Transaction>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
  },
  {
    accessorKey: "type",
    header: "Transaction Type",
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: "Description",
    enableSorting: false,
  },
];

export default function TransactionDataTable() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  const { data, isLoading } = api.transaction.getTableData.useQuery({
    societyId: id,
    from: searchParams.get("from")
      ? new Date(searchParams.get("from")!)
      : startOfMonth(new Date()),
    to: searchParams.get("to")
      ? new Date(searchParams.get("to")!)
      : endOfMonth(new Date()),
  });
  return (
    <Card className="my-2">
      <CardHeader>
        <CardTitle>Transaction Data Table</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : data && data.length === 0 ? (
          <NotFound message="No Transaction data found for the selected period" />
        ) : (
          data && <DataTable columns={columns} data={data} />
        )}
      </CardContent>
    </Card>
  );
}
