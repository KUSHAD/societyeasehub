import React from "react";
import { checkChannelExists } from "~/actions/checkChannelExists";
import { canManageChannels, canSendMessages } from "~/actions/checkUserRole";
import ClientOnly from "~/components/ClientOnly";
import ChannelTopBar from "~/components/society/channel/ChannelTopBar";
import ChatInput from "~/components/society/channel/chat/ChatInput";
import { ScrollArea } from "~/components/ui/scroll-area";

export default async function ChannelLayout({
  children,
  params: { societyId, channelId },
}: {
  children: React.ReactNode;
  params: { societyId: string; channelId: string };
}) {
  await checkChannelExists(channelId, societyId);
  const canSend = await canSendMessages(societyId);
  const canManage = await canManageChannels(societyId);
  return (
    <div className="overflow-hidden">
      <ClientOnly>
        <ChannelTopBar />
      </ClientOnly>
      <ScrollArea className="flex h-[400px] flex-col overflow-auto lg:h-[525px]">
        {children}
      </ScrollArea>
      <div className="m-2">
        {canSend || canManage ? (
          <ClientOnly>
            <ChatInput />
          </ClientOnly>
        ) : null}
      </div>
    </div>
  );
}
