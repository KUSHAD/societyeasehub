"use client";

import { Draggable } from "@hello-pangea/dnd";
import { type RoadmapCard } from "@prisma/client";

interface CardItemProps {
  index: number;
  card: RoadmapCard;
}

export default function CardItem({ card, index }: CardItemProps) {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role="button"
          className="truncate rounded-md border-2 border-transparent bg-background px-3 py-2 text-sm shadow-sm hover:border-black"
        >
          {card.title}
        </div>
      )}
    </Draggable>
  );
}
