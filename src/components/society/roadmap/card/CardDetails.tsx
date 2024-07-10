"use client";

import { useParams } from "next/navigation";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";

interface CardDetailsProps {
  cardId: string;
}

export default function CardDetails({ cardId }: CardDetailsProps) {
  const { societyId } = useParams<{ societyId: string }>();
  const { isPending, data: card } = api.roadmapCard.getById.useQuery({
    cardId,
    societyId,
  });
  return isPending ? (
    <Skeleton className="my-2 h-[200px] w-full rounded" />
  ) : (
    card && (
      <div className="my-2 flex flex-col">
        <div className="my-2 flex flex-row">
          <strong>Title </strong>
          <em>{card.title}</em>
        </div>
        <div className="my-2 flex flex-row">
          <strong>Description </strong>
          <em>{card.description}</em>
        </div>
        <div className="my-2 flex flex-row">
          <strong>List </strong>
          <em>{card.list}</em>
        </div>
      </div>
    )
  );
}
