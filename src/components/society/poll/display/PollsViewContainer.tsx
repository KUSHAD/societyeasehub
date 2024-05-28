"use client";

import { useParams } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import NotFound from "~/components/NotFound";
import { api } from "~/trpc/react";
import PollViewer from "./PollViewer";

export default function PollsViewContainer() {
  const { societyId } = useParams<{ societyId: string }>();
  const { data: polls, isLoading } = api.poll.getBySociety.useQuery({
    societyId,
  });
  return isLoading ? (
    <Skeleton className="my-2 h-[200px] w-full" count={5} />
  ) : polls && polls.length !== 0 ? (
    polls.map((_poll) => <PollViewer key={_poll.id} poll={_poll} />)
  ) : (
    <NotFound
      message="No Polls Found"
      description="Once a poll is created they will appear here"
    />
  );
}
