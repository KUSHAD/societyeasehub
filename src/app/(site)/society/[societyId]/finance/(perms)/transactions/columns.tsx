"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { ArrowUpDown } from "lucide-react";
import TransactionActions from "~/components/society/finance/transactions/TransactionActions";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { type RouterOutput } from "~/lib/types";
import { convertAmountFromMiliUnits, formatCurrency } from "~/lib/utils";

type ResponseType =
  RouterOutput["financeTransaction"]["getBySocietyAndAccounts"][0];

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
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({
      row: {
        original: { date },
      },
    }) => format(date, "dd MMM, yyyy"),
  },
  {
    id: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.category?.name ?? "Uncategorized",
  },
  {
    id: "payee",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Payee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.payee.name,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Badge
        variant={row.original.amount < 0 ? "destructive" : "default"}
        className="rounded-xl p-2 text-xs font-medium"
      >
        {formatCurrency(convertAmountFromMiliUnits(row.original.amount))}
      </Badge>
    ),
  },
  {
    id: "account",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Account
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.account?.name,
  },
  {
    id: "actions",
    cell: ({
      row: {
        original: { id },
      },
    }) => <TransactionActions transactionId={id} />,
    enableHiding: false,
  },
];
