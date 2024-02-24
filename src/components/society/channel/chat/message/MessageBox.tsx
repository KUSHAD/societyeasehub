"use client";

import { useSession } from "next-auth/react";
import { type ChannelMessage } from "~/lib/types";
import MessageMemberCard from "../../../MessageMemberCard";

interface MessageBoxProps {
  message: ChannelMessage;
}

export default function MessageBox({ message }: MessageBoxProps) {
  const { data } = useSession();
  return data && data.user.email === message.member.email ? (
    <div className="flex flex-row">
      <div className="mr-auto" />
      <div className="my-2 flex w-1/2 flex-col rounded-lg bg-primary">
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
        <div className="px-2 py-2">{message.content}</div>
      </div>
    </>
  );
}
