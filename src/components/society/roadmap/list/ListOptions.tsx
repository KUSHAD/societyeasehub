"use client";

import { type RoadmapList } from "@prisma/client";
import { MoreHorizontal } from "lucide-react";
import { useParams } from "next/navigation";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import CardForm from "../card/CardForm";
import { useState } from "react";
import EditList from "./EditList";
import { useShareModalStore } from "~/store/shareModal";
import { absoluteUrl } from "~/lib/utils";

interface ListOptionsProps {
  list: RoadmapList;
}

export default function ListOptions({ list }: ListOptionsProps) {
  const [modalType, setModalType] = useState<"CARD" | "EDIT">("CARD");

  const utils = api.useUtils();
  const { societyId } = useParams<{ societyId: string }>();
  const { onOpen } = useShareModalStore();
  const { isPending: gettingPerms, data: canManage } =
    api.perms.canManageRoadmaps.useQuery({
      societyId,
    });
  const { isPending: isDeleting, mutate: deleteList } =
    api.roadmapList.delete.useMutation({
      async onSuccess() {
        await utils.roadmapList.getBySociety.invalidate({ societyId });
        toast({
          title: "Message",
          description: "List Deleted",
        });
      },
    });

  const { isPending: copying, mutate: copyList } =
    api.roadmapList.copy.useMutation({
      async onSuccess() {
        await utils.roadmapList.getBySociety.invalidate({ societyId });
        toast({
          title: "Message",
          description: "List Copied",
        });
      },
    });

  return gettingPerms ? null : canManage ? (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="absolute right-0">
          <DropdownMenuLabel>List Options</DropdownMenuLabel>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onClick={() => setModalType("EDIT")}
              disabled={isDeleting || copying}
            >
              Rename List
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onClick={() => setModalType("CARD")}
              disabled={isDeleting || copying}
            >
              Add Card
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <DropdownMenuItem
            onClick={() =>
              copyList({
                listId: list.id,
                societyId,
              })
            }
            disabled={isDeleting || copying}
          >
            Copy this List
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              onOpen(absoluteUrl(`/api/integration/roadmap/${list.id}`))
            }
            disabled={isDeleting || copying}
          >
            Integrate List
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={isDeleting || copying}
            onClick={() =>
              deleteList({
                listId: list.id,
                societyId,
              })
            }
          >
            Delete this List
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {modalType === "CARD" ? "Add Card" : "Rename List"}
          </AlertDialogTitle>
        </AlertDialogHeader>
        {modalType === "CARD" ? (
          <CardForm listId={list.id} />
        ) : (
          <EditList listId={list.id} title={list.title} />
        )}
      </AlertDialogContent>
    </AlertDialog>
  ) : null;
}
