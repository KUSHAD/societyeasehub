import MessageSkeleton from "~/components/society/channel/chat/message/MessageSkeleton";
import { ScrollArea } from "~/components/ui/scroll-area";

export default function Loading() {
  return (
    <div className="overflow-hidden">
      <ScrollArea className="flex h-[300px] flex-col overflow-auto md:h-[400px] lg:h-[525px]">
        <MessageSkeleton />
      </ScrollArea>
    </div>
  );
}
