"use client";

import { type ListWithCards } from "~/lib/types";
import ListHeader from "./ListHeader";
import { cn } from "~/lib/utils";
import CardItem from "../card/CardItem";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";
import { Skeleton } from "~/components/ui/skeleton";
import { Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import CardForm from "../card/CardForm";
import { Draggable, Droppable } from "@hello-pangea/dnd";

interface ListItemProps {
  index: number;
  data: ListWithCards;
}

export default function ListItem({ data, index }: ListItemProps) {
  const { societyId } = useParams<{ societyId: string }>();
  const { isLoading: gettingPerms, data: canManage } =
    api.perms.canManageRoadmaps.useQuery({
      societyId,
    });
  return (
    <Draggable
      index={index}
      draggableId={data.id}
      isDragDisabled={gettingPerms || !canManage}
    >
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="h-full w-[272px] shrink-0 select-none"
        >
          <div
            {...provided.dragHandleProps}
            className="w-full rounded-md bg-muted pb-2 shadow-md"
          >
            <ListHeader list={data} />
            <Droppable droppableId={data.id} type="card">
              {(provided) => (
                <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "mx-1 flex flex-col gap-y-2 px-1 py-0.5",
                    data.cards.length > 0 ? "mt-2" : "mt-0",
                  )}
                >
                  {data.cards.map((_card, index) => (
                    <CardItem index={index} key={_card.id} card={_card} />
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
            {gettingPerms ? (
              <Skeleton className="my-2 h-10 w-full" />
            ) : (
              canManage && (
                <AlertDialog>
                  <div className="mx-1 my-2">
                    <AlertDialogTrigger asChild>
                      <Button className="w-full">
                        <Plus className="mx-1" />
                        Add a list
                      </Button>
                    </AlertDialogTrigger>
                  </div>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Add Card</AlertDialogTitle>
                    </AlertDialogHeader>
                    <CardForm listId={data.id} />
                  </AlertDialogContent>
                </AlertDialog>
              )
            )}
          </div>
        </li>
      )}
    </Draggable>
  );
}
