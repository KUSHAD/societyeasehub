"use client";

import { useParams, useRouter } from "next/navigation";
import NotFound from "~/components/NotFound";
import { api } from "~/trpc/react";
import StreamPlayer from "./StreamPlayer";
import Skeleton from "react-loading-skeleton";
import { Button, buttonVariants } from "~/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

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
      >
        <Link className={buttonVariants()} href={`/society/${id}/meeting`}>
          <ChevronLeft className="mx-1" /> Back to Meettings
        </Link>
      </NotFound>
    );
  }

  if (meeting?.afterTime) {
    return (
      <NotFound message="Meeting has ended">
        <Button
          onClick={() => (window.location.href = `/society/${id}/meeting`)}
        >
          <ChevronLeft className="mx-1" /> Back to Meettings
        </Button>
      </NotFound>
    );
  }

  return isLoading ? (
    <Skeleton className="h-[300px] w-full" />
  ) : (
    <StreamPlayer />
  );
}
