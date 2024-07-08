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
import SocietyRoleCheckBox from "./SocietyRoleCheckBox";

export interface ChannelActionsProps {
  channelName: string;
}

export default function ChannelActions({ channelName }: ChannelActionsProps) {
  const { societyId } = useParams<{ societyId: string }>();
  const { isPending, data: canManage } = api.perms.canManageChannels.useQuery({
    societyId,
  });
  const [modal, setModal] = useState<"EDIT" | "DELETE" | "ROLE">("EDIT");
  return isPending ? null : canManage ? (
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
        ) : modal === "DELETE" ? (
          <DeleteChannel />
        ) : (
          <SocietyRoleCheckBox />
        )}
      </AlertDialogContent>
    </AlertDialog>
  ) : null;
}
