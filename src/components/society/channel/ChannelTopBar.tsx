"use client";

import ChannelActions from "./ChannelActions";
import { useParams } from "next/navigation";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";

export default function ChannelTopBar() {
  const { id, channelId } = useParams<{ id: string; channelId: string }>();

  const { isLoading, data: name } = api.channel.getName.useQuery({
    channelId,
    societyId: id,
  });
  return (
    <div className="w-full bg-muted">
      <div className="flex flex-row px-2 py-4">
        <span className="my-2 mr-auto select-none font-bold">
          {isLoading ? (
            <Skeleton className="h-4 w-[50px]" />
          ) : (
            name && `#${name}`
          )}
        </span>
        {isLoading ? (
          <Skeleton className="h-[40px] w-6" />
        ) : (
          name && <ChannelActions channelName={name} />
        )}
      </div>
    </div>
  );
}
