import React from "react";
import { checkChannelExists } from "~/actions/checkChannelExists";
import { canSendMessages } from "~/actions/checkUserRole";
import ClientOnly from "~/components/ClientOnly";
import ChatInput from "~/components/society/channel/chat/ChatInput";
import { ScrollArea } from "~/components/ui/scroll-area";

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
    <div className="overflow-hidden">
      <ScrollArea className="flex h-[400px] flex-col overflow-auto lg:h-[525px]">
        {children}
      </ScrollArea>
      <div className="m-2">
        {canSend ? (
          <ClientOnly>
            <ChatInput />
          </ClientOnly>
        ) : null}
      </div>
    </div>
  );
}
