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
import EditAccountSheet from "./EditAccountSheet";
import useConfirm from "~/hooks/use-confirm";
import { api } from "~/trpc/react";
import { toast } from "~/components/ui/use-toast";
import { useParams } from "next/navigation";

export default function AccountActions({ accountId }: { accountId: string }) {
  const { societyId } = useParams<{ societyId: string }>();

  const [isOpen, setIsOpen] = useState(false);
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure ?",
    "You are going to delete this account",
  );
  const utils = api.useUtils();

  const { mutate: remove, isLoading: deleting } =
    api.financeAccounts.delete.useMutation({
      async onSuccess() {
        await utils.financeAccounts.getBySociety.invalidate({
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
          description: "Account Deleted",
        });
      },
    });
  return (
    <>
      <ConfirmDialog />
      <EditAccountSheet id={accountId} isOpen={isOpen} setIsOpen={setIsOpen} />
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
                  accountId: [accountId],
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
