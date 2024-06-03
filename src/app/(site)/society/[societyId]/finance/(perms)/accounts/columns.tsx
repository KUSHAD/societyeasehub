"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown } from "lucide-react";
import AccountActions from "~/components/society/finance/accounts/AccountActions";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { type RouterOutput } from "~/lib/types";

type ResponseType = RouterOutput["transactionAccounts"]["getBySociety"][0];

export const columns: ColumnDef<ResponseType>[] = [
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableHiding: false,
  },
  {
    id: "actions",
    cell: ({
      row: {
        original: { id },
      },
    }) => <AccountActions accountId={id} />,
    enableHiding: false,
  },
];
