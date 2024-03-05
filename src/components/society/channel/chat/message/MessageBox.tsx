"use client";

import { useSession } from "next-auth/react";
import { type ChannelMessage } from "~/lib/types";
import MessageMemberCard from "../../../MessageMemberCard";
import MediaRenderer from "../MediaRenderer";
import { Suspense } from "react";
import { RefreshCcw } from "lucide-react";
import MessageOptions from "./MessageOptions";

interface MessageBoxProps {
  message: ChannelMessage;
}

export default function MessageBox({ message }: MessageBoxProps) {
  const { data } = useSession();
  return data && data.user.email === message.member.email ? (
    <div className="flex flex-row">
      <div className="mr-auto" />
      <div className="my-2 flex w-1/2 flex-col rounded-lg bg-primary">
        <MessageOptions self />
        <Suspense
          fallback={
            <div className="flex justify-center">
              <RefreshCcw className="animate-spin text-muted" />
              <div className="sr-only">Media Loading</div>
            </div>
          }
        >
          {message.attachments.map(async (_attachment) => (
            <MediaRenderer uri={_attachment.uri} key={_attachment.uri} />
          ))}
        </Suspense>
        <div className="px-2 py-2 text-muted">{message.content}</div>
      </div>
    </div>
  ) : (
    <>
      <MessageMemberCard
        image={message.member.image}
        name={message.member.name}
        userId={message.member.userId}
        societyId={message.member.societyId}
      />
      <div className="my-2 flex w-1/2 flex-col rounded-lg bg-muted">
        <MessageOptions />
        <Suspense
          fallback={
            <div className="flex justify-center">
              <RefreshCcw className="animate-spin text-muted" />
              <div className="sr-only">Media Loading</div>
            </div>
          }
        >
          {message.attachments.map(async (_attachment) => (
            <MediaRenderer uri={_attachment.uri} key={_attachment.uri} />
          ))}
        </Suspense>
        <div className="px-2 py-2">{message.content}</div>
      </div>
    </>
  );
}
