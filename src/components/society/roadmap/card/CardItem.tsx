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

interface CardItemProps {
  index: number;
  card: RoadmapCard;
}

export default function CardItem({ card, index }: CardItemProps) {
  const { id } = useParams<{ id: string }>();

  const { isLoading, data: canAccess } = api.member.canManageRoadmaps.useQuery({
    societyId: id,
  });

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
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
                    <Button variant="outline">Copy This Card</Button>
                    <Button>Edit This Card</Button>
                  </>
                )
              )}
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </Draggable>
  );
}
