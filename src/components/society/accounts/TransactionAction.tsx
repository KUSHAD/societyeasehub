"use client";

import { MoreHorizontal } from "lucide-react";
import { useParams } from "next/navigation";
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

interface TransactionActionProps {
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
        <DropdownMenuItem disabled={isLoading}>View</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
