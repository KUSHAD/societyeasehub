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
import { useState } from "react";
import AddDocs from "./AddDocs";

export interface TransactionActionProps {
  transaction: SafeTransaction;
}

export default function TransactionAction({
  transaction,
}: TransactionActionProps) {
  const [modalContent, setModalContent] = useState<"UPDATE" | "DOCS">("UPDATE");
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
            <DropdownMenuItem
              onClick={() => setModalContent("UPDATE")}
              disabled={isLoading}
            >
              Update
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onClick={() => setModalContent("DOCS")}
              disabled={isLoading}
            >
              Add Docs
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        {modalContent === "UPDATE" ? (
          <UpdateTransaction transaction={transaction} />
        ) : (
          <AddDocs transactionId={transaction.id} />
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
