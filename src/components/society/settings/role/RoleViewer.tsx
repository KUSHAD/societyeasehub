"use client";

import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import { MoreVertical, User } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { type SafeRole } from "~/lib/types";
import UpdateRole from "./UpdateRole";
import DeleteRole from "./DeleteRole";

interface RoleViewerProps {
  role: SafeRole & {
    _count: {
      members: number;
    };
  };
}

export default function RoleViewer({ role }: RoleViewerProps) {
  const [open, setOpen] = useState<"edit" | "delete" | null>(null);

  return (
    <>
      <div className="my-2 w-full scale-95 rounded bg-accent shadow-md">
        <div className="mx-4 flex flex-row justify-between py-2">
          <strong className="my-2">{role.name}</strong>
          <div className="my-2 flex flex-row">
            <User /> <span>{role._count.members}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                className="mx-2 rounded-full"
                variant="outline"
              >
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="absolute right-0">
              <DropdownMenuItem onClick={() => setOpen("edit")}>
                Edit <Pencil2Icon className="mx-2" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setOpen("delete")}
                className="text-destructive"
              >
                Delete <TrashIcon className="mx-2" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <AlertDialog
        open={Boolean(open === "edit")}
        onOpenChange={() => setOpen(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Role</AlertDialogTitle>
          </AlertDialogHeader>
          <UpdateRole id={role.id} />
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(open === "delete")}
        onOpenChange={() => setOpen(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
          </AlertDialogHeader>
          <DeleteRole roleId={role.id} />
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
