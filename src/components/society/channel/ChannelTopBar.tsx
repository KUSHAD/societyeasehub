"use client";

import ChannelActions from "./ChannelActions";
import { useParams } from "next/navigation";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";

export default function ChannelTopBar() {
  const { societyId, channelId } = useParams<{
    societyId: string;
    channelId: string;
  }>();

  const { isPending, data: name } = api.channel.getName.useQuery({
    channelId,
    societyId,
  });
  return (
    <div className="w-full bg-muted">
      <div className="flex flex-row px-2 py-4">
        <span className="my-2 mr-auto select-none font-bold">
          {isPending ? (
            <Skeleton className="h-4 w-[50px]" />
          ) : (
            name && `#${name}`
          )}
        </span>
        {isPending ? (
          <Skeleton className="h-[40px] w-6" />
        ) : (
          name && <ChannelActions channelName={name} />
        )}
      </div>
    </div>
  );
}
