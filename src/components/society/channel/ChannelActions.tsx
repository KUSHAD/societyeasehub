"use client";

import { MoreHorizontal } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
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
import { api } from "~/trpc/react";
import EditChannel from "./EditChannel";
import DeleteChannel from "./DeleteChannel";

export interface ChannelActionsProps {
  channelName: string;
}

export default function ChannelActions({ channelName }: ChannelActionsProps) {
  const { id } = useParams<{ id: string }>();
  const { isLoading, data: canManage } = api.perms.canManageChannels.useQuery({
    societyId: id,
  });
  const [modal, setModal] = useState<"EDIT" | "DELETE">("EDIT");
  return isLoading ? null : canManage ? (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Channel Actions</DropdownMenuLabel>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onClick={() => setModal("EDIT")}>
              Edit Channel Name
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onClick={() => setModal("DELETE")}>
              Delete Channel
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        {modal === "EDIT" ? (
          <EditChannel channelName={channelName} />
        ) : (
          <DeleteChannel />
        )}
      </AlertDialogContent>
    </AlertDialog>
  ) : null;
}
