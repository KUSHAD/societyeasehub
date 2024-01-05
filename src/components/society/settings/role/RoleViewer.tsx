"use client";

import { Pencil2Icon, TrashIcon, PersonIcon } from "@radix-ui/react-icons";
import { Info, MoreVertical, User, Check, X } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { type SafeRole } from "~/lib/types";
import UpdateRole from "./UpdateRole";

interface RoleViewerProps {
  role: SafeRole & {
    _count: {
      members: number;
    };
  };
}

export default function RoleViewer({ role }: RoleViewerProps) {
  const [open, setOpen] = useState<"edit" | "assign" | "delete" | null>(null);

  return (
    <>
      <div className="my-2 w-full scale-95 rounded bg-accent shadow-md">
        <div className="mx-4 flex flex-row justify-between py-2">
          <strong className="my-2">{role.name}</strong>
          <div className="my-2 flex flex-row">
            <User /> <span>{role._count.members}</span>
          </div>
          <div className="flex flex-row">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    className="mx-2 rounded-full"
                    variant="ghost"
                  >
                    <Info />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="flex flex-col">
                  <div className="flex flex-row">
                    <span className="my-1">Access General Settings Page</span>
                    {role.accessGeneral ? (
                      <Check className="mx-2" />
                    ) : (
                      <X className="mx-2" />
                    )}
                  </div>
                  <div className="flex flex-row">
                    <span className="my-1">Access Role Settings Page</span>
                    {role.accessRole ? (
                      <Check className="mx-2" />
                    ) : (
                      <X className="mx-2" />
                    )}
                  </div>
                  <div className="flex flex-row">
                    <span className="my-1">Access Danger Settings Page</span>
                    {role.accessDanger ? (
                      <Check className="mx-2" />
                    ) : (
                      <X className="mx-2" />
                    )}
                  </div>
                  <div className="flex flex-row">
                    <span className="my-1">Create and send invites</span>
                    {role.createInvite ? (
                      <Check className="mx-2" />
                    ) : (
                      <X className="mx-2" />
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  className="mx-2 rounded-full"
                  variant="ghost"
                >
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="absolute right-0">
                <DropdownMenuItem onClick={() => setOpen("edit")}>
                  Edit <Pencil2Icon className="mx-2" />
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Assign <PersonIcon className="mx-2" />
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Delete <TrashIcon className="mx-2" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
    </>
  );
}
