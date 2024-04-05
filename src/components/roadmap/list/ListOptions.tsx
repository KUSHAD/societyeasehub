"use client";

import { type RoadmapList } from "@prisma/client";
import { MoreHorizontal } from "lucide-react";
import { useParams } from "next/navigation";
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

interface ListOptionsProps {
  list: RoadmapList;
  onAddCard: () => void;
}

export default function ListOptions({ list, onAddCard }: ListOptionsProps) {
  const utils = api.useUtils();
  const { id } = useParams<{ id: string }>();
  const { isLoading: gettingPerms, data: canManage } =
    api.member.canManageRoadmaps.useQuery({
      societyId: id,
    });
  const { isLoading: isDeleting, mutate: deleteList } =
    api.roadmapList.delete.useMutation({
      async onSuccess() {
        await utils.roadmapList.getBySociety.invalidate({ societyId: id });
        toast({
          title: "Message",
          description: "List Deleted",
        });
      },
    });

  const { isLoading: copying, mutate: copyList } =
    api.roadmapList.copy.useMutation({
      async onSuccess() {
        await utils.roadmapList.getBySociety.invalidate({ societyId: id });
        toast({
          title: "Message",
          description: "List Copied",
        });
      },
    });
  return gettingPerms ? null : canManage ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="absolute right-0">
        <DropdownMenuLabel>List Options</DropdownMenuLabel>
        <DropdownMenuItem disabled={isDeleting || copying} onClick={onAddCard}>
          Add Card
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            copyList({
              listId: list.id,
              societyId: id,
            })
          }
          disabled={isDeleting || copying}
        >
          Copy this List
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={isDeleting || copying}
          onClick={() =>
            deleteList({
              listId: list.id,
              societyId: id,
            })
          }
        >
          Delete this List
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : null;
}
