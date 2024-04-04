"use client";

import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import ListContainer from "./ListContainer";

export default function KanbanBoard() {
  const { id } = useParams<{ id: string }>();
  const { isLoading, data: lists } = api.roadmap.getBySociety.useQuery({
    societyId: id,
  });
  return isLoading ? <div>Loading</div> : <ListContainer data={lists!} />;
}
