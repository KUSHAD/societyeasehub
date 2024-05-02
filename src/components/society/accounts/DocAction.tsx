"use client";

import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { Button } from "~/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
} from "~/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import AddDocs from "./AddDocs";
import ViewDocs from "./ViewDocs";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";

export default function DocAction({
  transactionId,
}: {
  transactionId: string;
}) {
  const { id } = useParams<{ id: string }>();

  const { data: canManage, isLoading } = api.member.canManageAccounts.useQuery({
    societyId: id,
  });
  return (
    <AlertDialog>
      <Sheet>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Document Actions</DropdownMenuLabel>
            <SheetTrigger asChild>
              <DropdownMenuItem>View Docs</DropdownMenuItem>
            </SheetTrigger>
            {isLoading ? null : canManage ? (
              <AlertDialogTrigger asChild>
                <DropdownMenuItem>Add Docs</DropdownMenuItem>
              </AlertDialogTrigger>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent>
          <AddDocs transactionId={transactionId} />
        </AlertDialogContent>
        <SheetContent className="overflow-y-auto" side="left">
          <ViewDocs transactionId={transactionId} />
        </SheetContent>
      </Sheet>
    </AlertDialog>
  );
}
