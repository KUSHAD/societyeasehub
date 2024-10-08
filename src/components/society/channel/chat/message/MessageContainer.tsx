"use client";

import { useParams } from "next/navigation";
import NotFound from "~/components/NotFound";
import { api } from "~/trpc/react";
import MessageSkeleton from "./MessageSkeleton";
import MessageBox from "./MessageBox";

export default function MessageContainer() {
  const { channelId } = useParams<{ channelId: string }>();

  const { data: messages, isPending } = api.message.getByChannel.useQuery(
    {
      channelId,
    },
    {
      _optimisticResults: "optimistic",
    },
  );

  return (
    <div className="flex flex-col px-2">
      {isPending ? (
        <MessageSkeleton />
      ) : messages && messages.length === 0 ? (
        <NotFound
          message="No Messages"
          description="Send a message to this channel to see it here"
        />
      ) : (
        <>
          {messages?.map((_message) => (
            <MessageBox key={_message.id} message={_message} />
          ))}
        </>
      )}
    </div>
  );
}
