"use client";

import { MoreHorizontal } from "lucide-react";
import { useParams } from "next/navigation";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { toast } from "~/components/ui/use-toast";
import { type SafeTransaction } from "~/lib/types";
import { api } from "~/trpc/react";
import UpdateTransaction from "./UpdateTransaction";

export interface TransactionActionProps {
  transaction: SafeTransaction;
}

export default function TransactionAction({
  transaction,
}: TransactionActionProps) {
  const utils = api.useUtils();
  const { id } = useParams<{ id: string }>();
  const { isLoading, mutate: deleteTransaction } =
    api.transaction.delete.useMutation({
      async onSuccess() {
        await utils.transaction.invalidate();
        toast({
          title: "Message",
          description: "Deleted Transaction",
        });
      },
    });
  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="absolute right-0">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            disabled={isLoading}
            onClick={() => navigator.clipboard.writeText(transaction.id)}
          >
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isLoading}
            onClick={() =>
              deleteTransaction({
                societyId: id,
                transactionID: [transaction.id],
              })
            }
          >
            Delete
          </DropdownMenuItem>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem disabled={isLoading}>Update</DropdownMenuItem>
          </AlertDialogTrigger>
          <DropdownMenuItem disabled={isLoading}>View Docs</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <UpdateTransaction transaction={transaction} />
      </AlertDialogContent>
    </AlertDialog>
  );
}
