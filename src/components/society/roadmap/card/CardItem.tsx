"use client";

import { Draggable } from "@hello-pangea/dnd";
import { type RoadmapCard } from "@prisma/client";
import {
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetContent,
  SheetFooter,
} from "~/components/ui/sheet";
import CardDetails from "./CardDetails";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";
import { Copy, Edit, Trash } from "lucide-react";
import { toast } from "~/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import EditCard from "./EditCard";

interface CardItemProps {
  index: number;
  card: RoadmapCard;
}

export default function CardItem({ card, index }: CardItemProps) {
  const { societyId } = useParams<{ societyId: string }>();

  const { isLoading, data: canAccess } = api.perms.canManageRoadmaps.useQuery({
    societyId,
  });

  const utils = api.useUtils();

  const { mutate: deleteCard, isLoading: deleting } =
    api.roadmapCard.delete.useMutation({
      async onSuccess() {
        await utils.roadmapList.getBySociety.invalidate({
          societyId,
        });
        toast({
          title: "Message",
          description: "Card Deleted",
        });
      },
    });

  const { mutate: copyCard, isLoading: copying } =
    api.roadmapCard.copy.useMutation({
      async onSuccess() {
        await utils.roadmapList.getBySociety.invalidate({
          societyId,
        });
        toast({
          title: "Message",
          description: "Card Copied",
        });
      },
    });

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <AlertDialog>
          <Sheet>
            <SheetTrigger asChild>
              <div
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                role="button"
                className="truncate rounded-md border-2 border-transparent bg-background px-3 py-2 text-sm shadow-sm hover:border-black"
              >
                {card.title}
              </div>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Card Details</SheetTitle>
              </SheetHeader>
              <CardDetails cardId={card.id} />
              <SheetFooter>
                {isLoading ? (
                  <Skeleton className="my-2 h-[40px] w-full rounded" />
                ) : (
                  canAccess && (
                    <>
                      <Button
                        disabled={copying || deleting}
                        onClick={() =>
                          copyCard({
                            cardId: card.id,
                            listId: card.listId,
                            societyId,
                          })
                        }
                        variant="outline"
                        size="icon"
                      >
                        <Copy />
                      </Button>
                      <Button
                        disabled={copying || deleting}
                        onClick={() =>
                          deleteCard({
                            cardId: card.id,
                            listId: card.listId,
                            societyId,
                          })
                        }
                        size="icon"
                        variant="destructive"
                      >
                        <Trash />
                      </Button>
                      <AlertDialogTrigger asChild>
                        <Button size="icon">
                          <Edit />
                        </Button>
                      </AlertDialogTrigger>
                    </>
                  )
                )}
              </SheetFooter>
            </SheetContent>
          </Sheet>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Edit Card</AlertDialogTitle>
            </AlertDialogHeader>
            <EditCard card={card} />
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Draggable>
  );
}
