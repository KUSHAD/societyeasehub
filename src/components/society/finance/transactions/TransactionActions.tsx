"use client";

import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import useConfirm from "~/hooks/use-confirm";
import { api } from "~/trpc/react";
import { toast } from "~/components/ui/use-toast";
import { useParams } from "next/navigation";
import EditTransactionSheet from "./EditTransactionSheet";

export default function TransactionActions({
  transactionId,
}: {
  transactionId: string;
}) {
  const { societyId } = useParams<{ societyId: string }>();

  const [isOpen, setIsOpen] = useState(false);
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure ?",
    "You are going to delete this transaction",
  );
  const utils = api.useUtils();

  const { mutate: remove, isLoading: deleting } =
    api.financeTransaction.delete.useMutation({
      async onSuccess() {
        await utils.financeTransaction.getBySocietyAndAccounts.invalidate({
          societyId,
        });

        toast({
          title: "Message",
          description: "Category Deleted",
        });
      },
    });
  return (
    <>
      <ConfirmDialog />
      <EditTransactionSheet
        id={transactionId}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <MoreHorizontal className="mr-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem disabled={deleting} onClick={() => setIsOpen(true)}>
            <Edit className="mr-2" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={deleting}
            onClick={async () => {
              const ok = await confirm();
              if (ok) {
                remove({
                  transactionId: [transactionId],
                  societyId,
                });
              }
            }}
          >
            <Trash className="mr-2" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
