"use client";

import { type RoadmapCard } from "@prisma/client";

interface CardItemProps {
  index: number;
  card: RoadmapCard;
}

export default function CardItem({ card }: CardItemProps) {
  return (
    <div
      role="button"
      className="truncate rounded-md border-2 border-transparent bg-background px-3 py-2 text-sm shadow-sm hover:border-black"
    >
      {card.title}
    </div>
  );
}
