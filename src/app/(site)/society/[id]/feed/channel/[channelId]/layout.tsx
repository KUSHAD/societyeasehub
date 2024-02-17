import React from "react";
import { checkChannelExists } from "~/actions/checkChannelExists";
import { canSendMessages } from "~/actions/checkUserRole";
import ClientOnly from "~/components/ClientOnly";
import ChatInput from "~/components/society/channel/ChatInput";

export default async function ChannelLayout({
  children,
  params: { id, channelId },
}: {
  children: React.ReactNode;
  params: { id: string; channelId: string };
}) {
  await checkChannelExists(channelId, id);
  const canSend = await canSendMessages(id);
  return (
    <>
      {children}
      {canSend ? (
        <ClientOnly>
          <ChatInput />
        </ClientOnly>
      ) : null}
    </>
  );
}
