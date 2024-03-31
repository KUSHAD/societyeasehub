"use client";

import { useParams, useRouter } from "next/navigation";
import NotFound from "~/components/NotFound";
import { api } from "~/trpc/react";
import StreamPlayer from "./StreamPlayer";
import Skeleton from "react-loading-skeleton";

export default function MeetingPlayer() {
  const { meetingId, id } = useParams<{ meetingId: string; id: string }>();

  const router = useRouter();

  const { data: meeting, isLoading } = api.meetingRoom.getById.useQuery(
    {
      id: meetingId,
    },
    {
      onError(err) {
        if (err.data?.code === "NOT_FOUND") {
          router.push(`/society/${id}/meeting`);
        }
      },
    },
  );

  if (meeting?.beforeTime) {
    return (
      <NotFound
        message="Sheesh You are Before time"
        description="Join when meeting starts"
      />
    );
  }

  if (meeting?.afterTime) {
    return <NotFound message="Meeting has ended" />;
  }

  return isLoading ? (
    <Skeleton className="h-[300px] w-full" />
  ) : (
    <StreamPlayer />
  );
}
