"use client";

import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import ListContainer from "./list/ListContainer";
import Skeleton from "react-loading-skeleton";

export default function KanbanBoard() {
  const { id } = useParams<{ id: string }>();
  const { isLoading, data: lists } = api.roadmapList.getBySociety.useQuery({
    societyId: id,
  });
  return isLoading ? (
    <Skeleton className="h-[100px] w-[273px]" />
  ) : (
    <ListContainer data={lists!} />
  );
}
