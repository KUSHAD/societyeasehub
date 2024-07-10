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
import EditCategorySheet from "./EditCategorySheet";

export default function CategoryActions({
  categoryId,
}: {
  categoryId: string;
}) {
  const { societyId } = useParams<{ societyId: string }>();

  const [isOpen, setIsOpen] = useState(false);
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure ?",
    "You are going to delete this category",
  );
  const utils = api.useUtils();

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
    <>
      <ConfirmDialog />
      <EditCategorySheet
        id={categoryId}
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
                  categoryId: [categoryId],
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
