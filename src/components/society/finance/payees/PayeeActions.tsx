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
import EditPayeeSheet from "./EditPayeeSheet";

export default function PayeeActions({ payeeId }: { payeeId: string }) {
  const { societyId } = useParams<{ societyId: string }>();

  const [isOpen, setIsOpen] = useState(false);
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure ?",
    "You are going to delete this payee",
  );
  const utils = api.useUtils();

  const { mutate: remove, isLoading: deleting } =
    api.financePayee.delete.useMutation({
      async onSuccess() {
        await utils.financePayee.getBySociety.invalidate({
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
      <EditPayeeSheet id={payeeId} isOpen={isOpen} setIsOpen={setIsOpen} />
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
                  payeeId: [payeeId],
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
